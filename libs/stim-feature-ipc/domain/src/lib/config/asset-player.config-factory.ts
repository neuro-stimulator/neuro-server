import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import {
  KEY__PYTHON_PATH,
  KEY__PATH,
  KEY__COMMUNICATION_PORT,
  KEY__FRAME_RATE,
  KEY__OPEN_PORT_AUTOMATICALLY,
  ASSET_PLAYER_CONFIG_PREFIX
} from './asset-player.config-constants';
import { AssetPlayerModuleConfig } from './asset-player.config-descriptor';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AssetPlayerConfigFactory extends BaseModuleOptionsFactory<AssetPlayerModuleConfig> {}

export class AssetPlayerModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<AssetPlayerModuleConfig> implements AssetPlayerConfigFactory {

  constructor(config: ConfigService) {
    super(config, ASSET_PLAYER_CONFIG_PREFIX);
  }

  createOptions(): Promise<AssetPlayerModuleConfig> | AssetPlayerModuleConfig {
    return {
      pythonPath: this.readConfig(KEY__PYTHON_PATH),
      path: this.readConfig(KEY__PATH),
      communicationPort: this.readConfig(KEY__COMMUNICATION_PORT),
      frameRate: this.readConfig(KEY__FRAME_RATE),
      openPortAutomatically: this.readConfig(KEY__OPEN_PORT_AUTOMATICALLY)
    };
  }

}
