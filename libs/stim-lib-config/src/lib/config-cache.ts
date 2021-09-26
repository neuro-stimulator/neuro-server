import { Type } from '@nestjs/common';

import { BaseModuleOptionsFactory } from './interfaces';
import { ConfigType } from './config.type';

export interface CacheInfo {
  name?: string;
  factory?: Type<BaseModuleOptionsFactory<unknown>>;
}

export const CONFIG_CACHE: Record<ConfigType, CacheInfo> = {
  [ConfigType.AUTH]: {

  },
  [ConfigType.COMMON]: {

  },
  [ConfigType.CONNECTION]: {

  },
  [ConfigType.DATABASE]: {

  },
  [ConfigType.EXPERIMENT_RESULTS]: {

  },
  [ConfigType.EXPERIMENTS]: {

  },
  [ConfigType.FILE_BROWSER]: {

  },
  [ConfigType.IPC]: {

  },
  [ConfigType.PLAYER]: {

  },
  [ConfigType.SEED]: {

  },
  [ConfigType.SEQUENCES]: {

  },
  [ConfigType.SETTINGS]: {

  },
  [ConfigType.SOCKET]: {

  },
  [ConfigType.STIMULATOR]: {

  },
  [ConfigType.TRIGGERS]: {

  },
  [ConfigType.USERS]: {

  },
}
