import { BaseAsyncOptions, BaseModuleOptions } from '@neuro-server/stim-lib-config';

export interface DatabaseModuleConfig extends BaseModuleOptions {
  type: string;
  host: string;
  username: string;
  password: string;
  name: string;
  port: number;
  entities: string;
  migrations: string;
  migrationsRun: string;
  migrationsDir: string;
  inMemory: string;
  synchronize: string;
  // testing only keys
  prefix: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatabaseModuleAsyncConfig extends BaseAsyncOptions<DatabaseModuleConfig> {}
