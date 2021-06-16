import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { BaseAsyncConfigModule } from '@diplomka-backend/stim-lib-config';

import { SettingsController } from './infrastructure/controller/settings.controller';
import { SettingsFacade } from './infrastructure/service/settings.facade';
import { SettingsModuleAsyncConfig, SettingsModuleConfig } from './domain/config/settings-config.descriptor';
import { SettingsService } from './domain/services/settings.service';
import { TOKEN_SETTINGS_FILE_NAME } from './domain/tokens/token';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';
import { SETTINGS_MODULE_CONFIG_CONSTANT } from './domain/config/settings-module-config-constants';
import { SettingsModuleConfigFactoryImpl } from './domain/config/settings-module-config-factory';

@Global()
@Module({})
export class StimFeatureSettingsCoreModule {
  static forRoot(config: SettingsModuleConfig): DynamicModule {
    return {
      module: StimFeatureSettingsCoreModule,
      controllers: [SettingsController],
      imports: [CqrsModule, StimFeatureFileBrowserModule.forFeature()],
      providers: [
        {
          provide: TOKEN_SETTINGS_FILE_NAME,
          useValue: config.fileName,
        },

        SettingsService,
        SettingsFacade,

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
      ],
      exports: [TOKEN_SETTINGS_FILE_NAME],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureSettingsCoreModule,
      controllers: [SettingsController],
      imports: [
        CqrsModule,
        StimFeatureFileBrowserModule.forFeature(),
        BaseAsyncConfigModule.forRootAsync<SettingsModuleAsyncConfig, SettingsModuleConfig>({
          name: SETTINGS_MODULE_CONFIG_CONSTANT,
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => new SettingsModuleConfigFactoryImpl(config),
          inject: [ConfigService]
        })
      ],
      providers: [
        {
          provide: TOKEN_SETTINGS_FILE_NAME,
          useValue: 'oldFileName',
        },

        SettingsService,
        SettingsFacade,

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
      ],
      exports: [TOKEN_SETTINGS_FILE_NAME],
    }
  };
}
