import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import { KEY__FILE_NAME, SETTINGS_CONFIG_PREFIX } from './settings.config-constants';
import { SettingsModuleConfig } from './settings.config-descriptor';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsConfigFactory extends BaseModuleOptionsFactory<SettingsModuleConfig> {}

export class SettingsModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<SettingsModuleConfig> implements SettingsConfigFactory {

  constructor(config: ConfigService) {
    super(config, SETTINGS_CONFIG_PREFIX);
  }

  createOptions(): Promise<SettingsModuleConfig> | SettingsModuleConfig {
    return {
        fileName: this.readConfig(KEY__FILE_NAME)
      };
  }

}
