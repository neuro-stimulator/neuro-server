import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { BaseAsyncConfigModule } from '@diplomka-backend/stim-lib-config';

import { SETTINGS_MODULE_CONFIG_CONSTANT, SettingsModuleAsyncConfig, SettingsModuleConfig, SettingsModuleConfigFactoryImpl } from './domain/config';
import { SettingsController } from './infrastructure/controller/settings.controller';
import { SettingsFacade } from './infrastructure/service/settings.facade';
import { SettingsService } from './domain/services/settings.service';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';

@Global()
@Module({})
export class StimFeatureSettingsCoreModule {

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
        SettingsService,
        SettingsFacade,

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
      ],
    }
  }
}
