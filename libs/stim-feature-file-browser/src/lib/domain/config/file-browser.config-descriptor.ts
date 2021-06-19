import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

export interface FileBrowserModuleConfig extends BaseModuleOptions {
  appDataRoot: string;
}

export interface FileBrowserModuleAsyncConfig extends BaseAsyncOptions<FileBrowserModuleConfig> {}
