import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommonModuleConfig extends BaseModuleOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommonModuleAsyncConfig extends BaseAsyncOptions<CommonModuleConfig> {}
