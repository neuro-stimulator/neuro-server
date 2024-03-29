import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import {
  FILE_BROWSER_CONFIG_PREFIX, KEY__APP_DATA_ROOT
} from './file-browser.config-constants';
import { FileBrowserModuleConfig } from './file-browser.config-descriptor';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileBrowserConfigFactory extends BaseModuleOptionsFactory<FileBrowserModuleConfig> {}

export class FileBrowserModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<FileBrowserModuleConfig> implements FileBrowserConfigFactory {

  constructor(config: ConfigService) {
    super(config, FILE_BROWSER_CONFIG_PREFIX);
  }

  createOptions(): Promise<FileBrowserModuleConfig> | FileBrowserModuleConfig {
    return {
      appDataRoot: this.readConfig(KEY__APP_DATA_ROOT),
    };
  }

}
