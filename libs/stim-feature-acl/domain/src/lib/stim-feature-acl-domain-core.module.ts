import { AccessControl } from 'accesscontrol';

import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { ACL_MODULE_CONFIG_CONSTANT, AclModuleAsyncConfig, AclModuleConfig, AclModuleConfigFactoryImpl } from './config';
import { ACCESS_CONTROL_TOKEN } from './constants';
import { ENTITIES } from './model/entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';
import { TRANSFORMERS } from './transform';

@Global()
@Module({})
export class StimFeatureAclDomainCoreModule {

  static readonly accProvider = {
    provide: ACCESS_CONTROL_TOKEN,
    useValue: new AccessControl()
  };

  static forRootAsync(): DynamicModule {
    const configProvider = BaseAsyncConfigModule.forRootAsync<AclModuleAsyncConfig, AclModuleConfig>({
      name: ACL_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new AclModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimFeatureAclDomainCoreModule,
      imports: [
        TypeOrmModule.forFeature(ENTITIES),
        configProvider
      ],
      providers: [
        ...REPOSITORIES,
        ...SEEDERS,
        ...TRANSFORMERS,
        StimFeatureAclDomainCoreModule.accProvider
      ],
      exports: [
        ...REPOSITORIES,
        BaseAsyncConfigModule,
        StimFeatureAclDomainCoreModule.accProvider
      ]
    }
  }

}
