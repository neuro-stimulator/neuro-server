import { createKey } from '@diplomka-backend/stim-lib-config';

export const AUTH_MODULE_CONFIG_CONSTANT = 'AUTH_MODULE_CONFIG_CONSTANT';
export const AUTH_CONFIG_PREFIX = 'auth';

export const KEY__JWT__SECRET_KEY = createKey<string>('jwt.secretKey', String, { use: 'required' });
export const KEY__JWT__ACCESS_TOKEN_TTL = createKey<number>('jwt.accessTokenTTL', Number, { defaultValue: 1 });
export const KEY__JWT__REFRESH_TOKEN_TTL = createKey<number>('jwt.refreshTokenTTL', Number, { defaultValue: 300 });
export const KEY__JWT__REFRESH_TOKEN_LENGTH = createKey<number>('jwt.refreshTokenLength', Number, { defaultValue: 64 });
export const KEY__JWT__TIMEZONE = createKey<string>('jwt.timeZone', String, { defaultValue: 'Europe/Prague' });
