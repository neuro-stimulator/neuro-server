import { DynamicModule, Module } from '@nestjs/common';

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
      providers: [SettingsFacade],
      exports: [SettingsFacade],
    };
  }
}
