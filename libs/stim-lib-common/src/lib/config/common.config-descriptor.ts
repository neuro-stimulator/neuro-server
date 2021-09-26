import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

export interface CommonModuleConfig extends BaseModuleOptions {
}


export interface CommonModuleAsyncConfig extends BaseAsyncOptions<CommonModuleConfig> {}
