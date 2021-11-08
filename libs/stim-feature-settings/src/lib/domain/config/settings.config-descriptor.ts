import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface SettingsModuleConfig extends BaseModuleOptions {
  fileName: string;
}

export interface SettingsModuleAsyncConfig extends BaseAsyncOptions<SettingsModuleConfig> {}
