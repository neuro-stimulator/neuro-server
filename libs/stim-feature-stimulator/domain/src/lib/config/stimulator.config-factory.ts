import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@diplomka-backend/stim-lib-config';

import { StimulatorModuleConfig } from './stimulator.config-descriptor';
import { KEY__VIRTUAL_SERIAL_SERVICE, KEY__TOTAL_OUTPUT_COUNT, STIMULATOR_CONFIG_PREFIX } from './stimulator.config-constants';

export interface StimulatorConfigFactory extends BaseModuleOptionsFactory<StimulatorModuleConfig> {}

export class StimulatorModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<StimulatorModuleConfig> implements StimulatorConfigFactory {

  constructor(config: ConfigService) {
    super(config, STIMULATOR_CONFIG_PREFIX);
  }

  createOptions(): Promise<StimulatorModuleConfig> | StimulatorModuleConfig {
    return {
      virtualSerialService: this.readConfig(KEY__VIRTUAL_SERIAL_SERVICE),
      totalOutputCount: this.readConfig(KEY__TOTAL_OUTPUT_COUNT)
    };
  }

}
