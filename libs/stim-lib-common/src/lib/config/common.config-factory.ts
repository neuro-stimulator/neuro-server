import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@diplomka-backend/stim-lib-config';

import { CommonModuleConfig } from './common.config-descriptor';
import { COMMON_CONFIG_PREFIX } from './common.config-constants';

export interface CommonConfigFactory extends BaseModuleOptionsFactory<CommonModuleConfig> {}

export class CommonModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<CommonModuleConfig> implements CommonConfigFactory {

  constructor(config: ConfigService) {
    super(config, COMMON_CONFIG_PREFIX);
  }

  createOptions(): Promise<CommonModuleConfig> | CommonModuleConfig {
    return {
    };
  }

}
