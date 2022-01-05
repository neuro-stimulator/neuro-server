import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface FileBrowserModuleConfig extends BaseModuleOptions {
  appDataRoot: string;
}

export interface FileBrowserModuleAsyncConfig extends BaseAsyncOptions<FileBrowserModuleConfig> {}
