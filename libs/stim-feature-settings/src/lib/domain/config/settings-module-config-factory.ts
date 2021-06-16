import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@diplomka-backend/stim-lib-config';

import { SettingsModuleConfig } from './settings-config.descriptor';
import { KEY__FILE_NAME, SETTINGS_CONFIG_PREFIX } from './settings-module-config-constants';

export interface SettingsModuleConfigFactory extends BaseModuleOptionsFactory<SettingsModuleConfig> {}

export class SettingsModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<SettingsModuleConfig> implements SettingsModuleConfigFactory {

  constructor(config: ConfigService) {
    super(config, SETTINGS_CONFIG_PREFIX);
  }

  createOptions(): Promise<SettingsModuleConfig> | SettingsModuleConfig {
    return {
        fileName: this.readConfig(KEY__FILE_NAME)
      }
  }

}
