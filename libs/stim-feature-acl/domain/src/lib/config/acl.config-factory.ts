import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import { AclModuleConfig } from './acl.config-descriptor';
import {
  ACL_CONFIG_PREFIX,
  KEY__ENABLED
} from './acl.config-constants';

export interface AclConfigFactory extends BaseModuleOptionsFactory<AclModuleConfig> {}

export class AclModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<AclModuleConfig> implements AclConfigFactory {

  constructor(config: ConfigService) {
    super(config, ACL_CONFIG_PREFIX);
  }

  createOptions(): Promise<AclModuleConfig> | AclModuleConfig {
    return {
      enabled: this.readConfig(KEY__ENABLED),
    };
  }

}
