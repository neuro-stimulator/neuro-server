import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import {
  ACL_CONFIG_PREFIX,
  KEY__ENABLED
} from './acl.config-constants';
import { AclModuleConfig } from './acl.config-descriptor';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
