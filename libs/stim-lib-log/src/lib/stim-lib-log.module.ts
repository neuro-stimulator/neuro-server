import { DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FILE_BROWSER_MODULE_CONFIG_CONSTANT } from '@neuro-server/stim-feature-file-browser/domain';
import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { LOG_MODULE_CONFIG_CONSTANT } from './config/log.config-constants';
import { LogModuleAsyncConfig, LogModuleConfig } from './config/log.config-descriptor';
import { LogModuleConfigFactoryImpl } from './config/log.config-factory';
import { Logger } from './logger';
import { loggerFactory } from './logger.factory';

export class StimLibLogModule {

  static forRoot(): DynamicModule {
    const configProvider = BaseAsyncConfigModule.forRootAsync<LogModuleAsyncConfig, LogModuleConfig>({
      name: LOG_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new LogModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    const loggerProvider: Provider = {
      provide: Logger,
      useFactory: loggerFactory,
      inject: [LOG_MODULE_CONFIG_CONSTANT, FILE_BROWSER_MODULE_CONFIG_CONSTANT]
    }

    return {
      module: StimLibLogModule,
      imports: [configProvider],
      providers: [loggerProvider],
      exports: [loggerProvider]
    } as DynamicModule;
  }

}
