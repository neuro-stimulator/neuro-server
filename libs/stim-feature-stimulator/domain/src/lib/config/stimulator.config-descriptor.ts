import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface StimulatorModuleConfig extends BaseModuleOptions {
  virtualSerialService: boolean;
  totalOutputCount: number;
}

export interface StimulatorModuleAsyncConfig extends BaseAsyncOptions<StimulatorModuleConfig> {}
