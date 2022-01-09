import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface SettingsModuleConfig extends BaseModuleOptions {
  fileName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SettingsModuleAsyncConfig extends BaseAsyncOptions<SettingsModuleConfig> {}
