import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

export interface StimulatorModuleConfig extends BaseModuleOptions {
  virtualSerialService: boolean;
  totalOutputCount: number;
}

export interface StimulatorModuleAsyncConfig extends BaseAsyncOptions<StimulatorModuleConfig> {}
