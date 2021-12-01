import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface AclModuleConfig extends BaseModuleOptions {
  enabled: boolean;
}


export interface AclModuleAsyncConfig extends BaseAsyncOptions<AclModuleConfig> {}
