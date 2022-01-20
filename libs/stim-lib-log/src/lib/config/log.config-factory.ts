import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import { LogModuleConfig } from './log.config-descriptor';
import {
  LOG_CONFIG_PREFIX,
  KEY__LEVELS,
  KEY__CUSTOM_LOGS,
  KEY__CONSOLE_ENABLED,
  KEY__CONSOLE_PROPERTIES_LEVEL,
  KEY__CONSOLE_PROPERTIES_COLORIZE,
  KEY__CONSOLE_PROPERTIES_JSON,
  KEY__CONSOLE_PROPERTIES_DATE_TIME_FORMAT,
  KEY__FILE_ENABLED,
  KEY__FILE_DIRECTORY,
  KEY__FILE_PROPERTIES_MAX_SIZE,
  KEY__FILE_PROPERTIES_MAX_FILES,
  KEY__FILE_PROPERTIES_NEW_ON_STARTUP,
  KEY__FILE_PROPERTIES_ZIP_OLD_LOGS,
  KEY__FILE_PROPERTIES_DATE_PATTERN,
  KEY__FILE_PROPERTIES_FILE_NAME,
  KEY__FILE_PROPERTIES_FILE_NAME_PATTERN,
  KEY__FILE_PROPERTIES_TAILABLE,
  KEY__FILE_PROPERTIES_JSON,
  KEY__FILE_PROPERTIES_LEVEL,
  DYNAMIC_KEY_PROVIDER__LEVEL,
  DYNAMIC_KEY_PROVIDER__ENABLED,
  DYNAMIC_KEY_PROVIDER__LABEL
} from './log.config-constants';
import { AbstractConfigSetLevels } from 'winston/lib/winston/config/index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LogConfigFactory extends BaseModuleOptionsFactory<LogModuleConfig> {}

export class LogModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<LogModuleConfig> implements LogConfigFactory {

  constructor(config: ConfigService) {
    super(config, LOG_CONFIG_PREFIX);
  }

  createOptions(): Promise<LogModuleConfig> | LogModuleConfig {
    const customLogs: string[] = this.readConfig(KEY__CUSTOM_LOGS);
    const [levels, levelNames] = this.readLevels();
    this.logger.log(`Možné úrovně logování: '${levelNames.join(',')}'`);

    return {
      levels,

      consoleLog: {
        enabled: this.readConfig(KEY__CONSOLE_ENABLED),
        properties: {
          level: this.readConfig(KEY__CONSOLE_PROPERTIES_LEVEL),
          colorize: this.readConfig(KEY__CONSOLE_PROPERTIES_COLORIZE),
          json: this.readConfig(KEY__CONSOLE_PROPERTIES_JSON),
          dateTimeFormat: this.readConfig(KEY__CONSOLE_PROPERTIES_DATE_TIME_FORMAT)
        }
      },
      fileLog: {
        enabled: this.readConfig(KEY__FILE_ENABLED),
        directory: this.readConfig(KEY__FILE_DIRECTORY),
        properties: {
          maxSize: this.readConfig(KEY__FILE_PROPERTIES_MAX_SIZE),
          maxFiles: this.readConfig(KEY__FILE_PROPERTIES_MAX_FILES),
          newOnStartup: this.readConfig(KEY__FILE_PROPERTIES_NEW_ON_STARTUP),
          zipOldLogs: this.readConfig(KEY__FILE_PROPERTIES_ZIP_OLD_LOGS),
          datePattern: this.readConfig(KEY__FILE_PROPERTIES_DATE_PATTERN),
          filename: this.readConfig(KEY__FILE_PROPERTIES_FILE_NAME),
          filenamePattern: this.readConfig(KEY__FILE_PROPERTIES_FILE_NAME_PATTERN),
          tailable: this.readConfig(KEY__FILE_PROPERTIES_TAILABLE),
          json: this.readConfig(KEY__FILE_PROPERTIES_JSON),
          level: this.readConfig(KEY__FILE_PROPERTIES_LEVEL)
        }
      },
      custom: customLogs.reduce((acc, curr: string) => {
        const enabled = this.readDynamicConfig(DYNAMIC_KEY_PROVIDER__ENABLED, curr);
        const level = this.readDynamicConfig(DYNAMIC_KEY_PROVIDER__LEVEL, curr);
        const label = this.readDynamicConfig(DYNAMIC_KEY_PROVIDER__LABEL, curr);

        if (!levelNames.includes(level)) {
          this.logger.error(`Logování do souboru ${curr} není možné, protože byla nastavena nevalidní úroveň ${level}!`);
          return acc;
        }

        acc[curr] = {
          enabled,
          level,
          label
        };

        return acc;
      }, {})
    } as LogModuleConfig;
  }

  protected readLevels(): [AbstractConfigSetLevels, string[]] {
    const levelsRaw: string = this.readConfig<string>(KEY__LEVELS);
    const levelsSplit = levelsRaw.split(',');
    const levels: AbstractConfigSetLevels = {};
    const levelNames = [];

    for (const value of levelsSplit) {
      const [level, priority] = value.split('=');
      levels[level] = +priority;
      levelNames.push(level);
    }

    return [levels, levelNames];
  }
}
