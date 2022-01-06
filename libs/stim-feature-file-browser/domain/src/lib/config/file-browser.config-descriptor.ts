import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface FileBrowserModuleConfig extends BaseModuleOptions {
  appDataRoot: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileBrowserModuleAsyncConfig extends BaseAsyncOptions<FileBrowserModuleConfig> {}
