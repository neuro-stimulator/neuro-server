import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface StimulatorModuleConfig extends BaseModuleOptions {
  virtualSerialService: boolean;
  totalOutputCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StimulatorModuleAsyncConfig extends BaseAsyncOptions<StimulatorModuleConfig> {}
