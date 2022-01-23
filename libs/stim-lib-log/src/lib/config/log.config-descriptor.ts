import { AbstractConfigSetLevels } from 'winston/lib/winston/config';

import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogModuleConfig extends BaseModuleOptions {
  levels: AbstractConfigSetLevels;
  levelNames: string[];

  consoleLog: {
    enabled: boolean;
    properties: {
      dateTimeFormat: string;
      level: string;
      colorize: boolean;
      json: boolean;
    }
  };

  fileLog: {
    enabled: boolean;
    directory: string;
    properties: {
      maxSize: number; // megabites
      maxFiles: number; // days
      newOnStartup: boolean;
      zipOldLogs: boolean;
      datePattern: string;
      filename: string;
      filenamePattern: string;
      tailable: boolean;
      json: boolean;
      level: string;
    }
  };

  custom: {
    [name: string]: {
      enabled: boolean;
      level: string;
      label: string;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogModuleAsyncConfig extends BaseAsyncOptions<LogModuleConfig> {
}
