import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';
import { QueryHandlers } from './application/queries';
import { SETTINGS_MODULE_CONFIG_CONSTANT, SettingsModuleAsyncConfig, SettingsModuleConfig, SettingsModuleConfigFactoryImpl } from './domain/config';
import { SettingsService } from './domain/services/settings.service';
import { SettingsController } from './infrastructure/controller/settings.controller';
import { SettingsFacade } from './infrastructure/service/settings.facade';

@Global()
@Module({})
export class StimFeatureSettingsCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureSettingsCoreModule,
      controllers: [SettingsController],
      imports: [
        CqrsModule,
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
