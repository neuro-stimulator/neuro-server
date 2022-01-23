/* eslint-disable max-len */
import { createDynamicKeyProvider, createKey, DYNAMIC_PART, DYNAMIC_FILE_NAME } from '@neuro-server/stim-lib-config';

export const LOG_MODULE_CONFIG_CONSTANT = 'LOG_MODULE_CONFIG_CONSTANT';
export const LOG_CONFIG_PREFIX = 'logger';
export const LOG_CONFIG_CONSOLE_PREFIX = 'console';
export const LOG_CONFIG_FILE_PREFIX = 'file';
export const LOG_CONFIG_PROPERTIES_PREFIX = 'properties';

export const KEY__LEVELS = createKey<string>(`${LOG_CONFIG_CONSOLE_PREFIX}.enabled`, String, { defaultValue: 'error=0,warn=1,info=2,debug=3,verbose=4' });

// console properties
export const KEY__CONSOLE_ENABLED = createKey<boolean>(`${LOG_CONFIG_CONSOLE_PREFIX}.enabled`, Boolean, { defaultValue: true });
export const KEY__CONSOLE_PROPERTIES_LEVEL = createKey<string>(`${LOG_CONFIG_CONSOLE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.level`, String, { defaultValue: 'verbose' });
export const KEY__CONSOLE_PROPERTIES_COLORIZE = createKey<boolean>(`${LOG_CONFIG_CONSOLE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.colorize`, Boolean, { defaultValue: true });
export const KEY__CONSOLE_PROPERTIES_JSON = createKey<boolean>(`${LOG_CONFIG_CONSOLE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.json`, Boolean, { defaultValue: false });
export const KEY__CONSOLE_PROPERTIES_DATE_TIME_FORMAT = createKey<string>(`${LOG_CONFIG_CONSOLE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.dateTimeFormat`, String, { defaultValue: 'DD.MM.YYYY HH:mm:ss:SSS' });

export const KEY__FILE_ENABLED = createKey<boolean>(`${LOG_CONFIG_FILE_PREFIX}.enabled`, Boolean, { defaultValue: true });
export const KEY__FILE_DIRECTORY = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.directory`, Boolean, { defaultValue: 'logs' });
export const KEY__FILE_PROPERTIES_LEVEL = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.level`, String, { defaultValue: 'verbose' });
export const KEY__FILE_PROPERTIES_MAX_SIZE = createKey<number>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.maxSize`, Number, { defaultValue: 1 });
export const KEY__FILE_PROPERTIES_MAX_FILES = createKey<number>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.maxFiles`, Number, { defaultValue: 20 });
export const KEY__FILE_PROPERTIES_NEW_ON_STARTUP = createKey<boolean>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.newOnStartup`, Boolean, { defaultValue: false });
export const KEY__FILE_PROPERTIES_ZIP_OLD_LOGS = createKey<boolean>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.zipOldLogs`, Boolean, { defaultValue: true });
export const KEY__FILE_PROPERTIES_DATE_PATTERN = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.datePattern`, String, { defaultValue: 'YYYY-MM-DD' });
export const KEY__FILE_PROPERTIES_FILE_NAME = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.fileName`, String, { defaultValue: 'all' });
export const KEY__FILE_PROPERTIES_FILE_NAME_PATTERN = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.fileNamePattern`, String, { defaultValue: `std-${DYNAMIC_FILE_NAME}-%DATE%.log` });
export const KEY__FILE_PROPERTIES_TAILABLE = createKey<boolean>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.tailable`, Boolean, { defaultValue: true });
export const KEY__FILE_PROPERTIES_JSON = createKey<boolean>(`${LOG_CONFIG_FILE_PREFIX}.${LOG_CONFIG_PROPERTIES_PREFIX}.json`, Boolean, { defaultValue: false });

export const KEY__CUSTOM_LOGS = createKey<string>(`${LOG_CONFIG_FILE_PREFIX}.customLogs`, String, { isArray: true });
export const DYNAMIC_KEY_PROVIDER__ENABLED = createDynamicKeyProvider<boolean>(`${LOG_CONFIG_FILE_PREFIX}.${DYNAMIC_PART}.enabled`, Boolean, { use: 'required' });
export const DYNAMIC_KEY_PROVIDER__LEVEL = createDynamicKeyProvider<string>(`${LOG_CONFIG_FILE_PREFIX}.${DYNAMIC_PART}.level`, String, { use: 'required' });
export const DYNAMIC_KEY_PROVIDER__LABEL = createDynamicKeyProvider<string>(`${LOG_CONFIG_FILE_PREFIX}.${DYNAMIC_PART}.label`, String, { defaultValue: null });
