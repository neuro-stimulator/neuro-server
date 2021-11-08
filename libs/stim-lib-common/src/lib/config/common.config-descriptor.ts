import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface CommonModuleConfig extends BaseModuleOptions {
}


export interface CommonModuleAsyncConfig extends BaseAsyncOptions<CommonModuleConfig> {}
