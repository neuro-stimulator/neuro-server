import { BaseAsyncOptions, BaseModuleOptions } from '@diplomka-backend/stim-lib-config';

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


export interface DatabaseModuleAsyncConfig extends BaseAsyncOptions<DatabaseModuleConfig> {}
