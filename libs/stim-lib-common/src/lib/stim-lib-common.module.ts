import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { CommonModuleAsyncConfig, CommonModuleConfig, COMMON_MODULE_CONFIG_CONSTANT, CommonModuleConfigFactoryImpl } from './config';
import { DtoFactory } from './dto-factory';

export class StimLibCommonModule {

  public static forRoot(): DynamicModule {

    const configProvider = BaseAsyncConfigModule.forRootAsync<CommonModuleAsyncConfig, CommonModuleConfig>({
      name: COMMON_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new CommonModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimLibCommonModule,
      global: true,
      imports: [configProvider],
      providers: [DtoFactory],
      exports: [DtoFactory],
    }

  }

}
