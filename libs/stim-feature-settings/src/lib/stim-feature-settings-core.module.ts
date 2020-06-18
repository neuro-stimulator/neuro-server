import { DynamicModule, Global, Module } from '@nestjs/common';

import { SettingsModuleConfig } from './domain/model/settings-module-config';
import { TOKEN_SETTINGS_FILE_NAME } from './domain/tokens/token';

@Global()
@Module({})
export class StimFeatureSettingsCoreModule {
  static forRoot(config: SettingsModuleConfig): DynamicModule {
    return {
      module: StimFeatureSettingsCoreModule,
      providers: [
        {
          provide: TOKEN_SETTINGS_FILE_NAME,
          useValue: config.fileName,
        },
      ],
      exports: [TOKEN_SETTINGS_FILE_NAME],
    };
  }
}
