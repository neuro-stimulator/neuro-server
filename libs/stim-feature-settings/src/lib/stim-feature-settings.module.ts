import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';
import { SettingsService } from './domain/services/settings.service';
import { SettingsController } from './infrastructure/controller/settings.controller';
import { SettingsFacade } from './infrastructure/service/settings.facade';
import { SettingsModuleConfig } from './domain/model/settings-module-config';
import { StimFeatureSettingsCoreModule } from './stim-feature-settings-core.module';

@Module({})
export class StimFeatureSettingsModule {
  static forRoot(config: SettingsModuleConfig): DynamicModule {
    return {
      module: StimFeatureSettingsModule,
      imports: [StimFeatureSettingsCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureSettingsModule,
      controllers: [SettingsController],
      imports: [StimFeatureFileBrowserModule.forFeature()],
      providers: [
        SettingsService,
        SettingsFacade,

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
      ],
      exports: [],
    };
  }
}
