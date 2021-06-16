import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SettingsFacade } from './infrastructure/service/settings.facade';
import { SettingsModuleConfig } from './domain/config/settings-config.descriptor';
import { StimFeatureSettingsCoreModule } from './stim-feature-settings-core.module';

@Module({})
export class StimFeatureSettingsModule {
  static forRoot(config: SettingsModuleConfig): DynamicModule {
    return {
      module: StimFeatureSettingsModule,
      imports: [StimFeatureSettingsCoreModule.forRoot(config)],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureSettingsModule,
      imports: [StimFeatureSettingsCoreModule.forRootAsync()]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureSettingsModule,
      imports: [CqrsModule],
      providers: [SettingsFacade],
      exports: [SettingsFacade],
    };
  }
}
