import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { AuthModuleAsyncConfig, AUTH_MODULE_CONFIG_CONSTANT, AuthModuleConfig, AuthModuleConfigFactoryImpl } from './config';
import { ENTITIES } from './model/entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';

@Global()
@Module({})
export class StimFeatureAuthDomainCoreModule {
  static forRootAsync(): DynamicModule {
    const configProvider = BaseAsyncConfigModule.forRootAsync<AuthModuleAsyncConfig, AuthModuleConfig>({
      name: AUTH_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new AuthModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimFeatureAuthDomainCoreModule,
      imports: [
        TypeOrmModule.forFeature(ENTITIES),
        configProvider
      ],
      providers: [
        ...REPOSITORIES,
        ...SEEDERS
      ],
      exports: [
        ...REPOSITORIES,
        BaseAsyncConfigModule
      ]
    };
  }
}
