import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface AssetPlayerModuleConfig extends BaseModuleOptions {
  pythonPath: string;
  path: string;
  communicationPort: number
  frameRate: number
  openPortAutomatically: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AssetPlayerModuleAsyncConfig extends BaseAsyncOptions<AssetPlayerModuleConfig> {}
