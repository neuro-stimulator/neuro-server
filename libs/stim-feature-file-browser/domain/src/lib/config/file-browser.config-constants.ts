import { createKey } from '@neuro-server/stim-lib-config';

export const FILE_BROWSER_MODULE_CONFIG_CONSTANT = 'FILE_BROWSER_MODULE_CONFIG_CONSTANT';
export const FILE_BROWSER_CONFIG_PREFIX = 'fileBrowser';

export const KEY__APP_DATA_ROOT = createKey<string>('appDataRoot', String, { use: 'required' });
