import { createKey } from '@neuro-server/stim-lib-config';

export const DATABASE_MODULE_CONFIG_CONSTANT = 'DATABASE_MODULE_CONFIG_CONSTANT';
export const DATABASE_CONFIG_PREFIX = 'database';

export const KEY__TYPE = createKey<string>('type', String, { defaultValue: 'sqlite', restriction: ['sqlite'] });
export const KEY__HOST = createKey<string>('host', String);
export const KEY__USERNAME = createKey<string>('username', String);
export const KEY__PASSWORD = createKey<string>('password', String);
export const KEY__NAME = createKey<string>('name', String, { defaultValue: 'database' });
export const KEY__PORT = createKey<number>('port', Number );
export const KEY__ENTITIES = createKey<string>('entities', String);
export const KEY__MIGRATIONS = createKey<string>('migrations', String);
export const KEY__MIGRATIONS_RUN = createKey<boolean>('migrationsRun', Boolean, { defaultValue: true });
export const KEY__MIGRATIONS_DIR = createKey<string>('migrationsDir', String);
export const KEY__IN_MEMORY = createKey<boolean>('inMemory', Boolean, { defaultValue: false });
export const KEY__SYNCHRONIZE = createKey<boolean>('synchronize', Boolean, { defaultValue: true });

// testing only keys
export const KEY__PREFIX = createKey<string>('prefix', String, { defaultValue: ''});
