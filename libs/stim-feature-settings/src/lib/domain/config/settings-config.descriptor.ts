import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

export interface SettingsModuleConfig extends BaseModuleOptions {
  fileName: string;
}

export interface SettingsModuleAsyncConfig extends BaseAsyncOptions<SettingsModuleConfig> {}
