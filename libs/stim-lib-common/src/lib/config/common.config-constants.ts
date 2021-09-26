import { createKey } from '@diplomka-backend/stim-lib-config';

export const COMMON_MODULE_CONFIG_CONSTANT = 'COMMON_MODULE_CONFIG_CONSTANT';
export const COMMON_CONFIG_PREFIX = '';

export const KEY__PRODUCTION = createKey<boolean>('production', Boolean, { defaultValue: true });
export const KEY__TESTING = createKey<boolean>('production', Boolean, { defaultValue: false });

