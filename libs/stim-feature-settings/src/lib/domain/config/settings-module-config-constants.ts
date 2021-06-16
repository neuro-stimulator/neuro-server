import { createKey } from '@diplomka-backend/stim-lib-config';

export const SETTINGS_MODULE_CONFIG_CONSTANT = 'SETTINGS_MODULE_CONFIG_CONSTANT';
export const SETTINGS_CONFIG_PREFIX = 'settings';

export const KEY__FILE_NAME = createKey<string>('filename', String, { use: 'required'});
