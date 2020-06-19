import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { SettingsController } from './infrastructure/controller/settings.controller';
import { SettingsFacade } from './infrastructure/service/settings.facade';
import { SettingsModuleConfig } from './domain/model/settings-module-config';
import { SettingsService } from './domain/services/settings.service';
import { TOKEN_SETTINGS_FILE_NAME } from './domain/tokens/token';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';

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
}
