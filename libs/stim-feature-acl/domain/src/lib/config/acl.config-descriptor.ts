import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface AclModuleConfig extends BaseModuleOptions {
  enabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AclModuleAsyncConfig extends BaseAsyncOptions<AclModuleConfig> {}
