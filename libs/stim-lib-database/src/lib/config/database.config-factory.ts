import { ConfigService } from '@nestjs/config';

import { AbstractModuleOptionsFactory, BaseModuleOptionsFactory } from '@neuro-server/stim-lib-config';

import {
  DATABASE_CONFIG_PREFIX,
  KEY__TYPE,
  KEY__HOST,
  KEY__USERNAME,
  KEY__PASSWORD,
  KEY__NAME,
  KEY__PORT,
  KEY__ENTITIES,
  KEY__MIGRATIONS,
  KEY__MIGRATIONS_RUN,
  KEY__MIGRATIONS_DIR,
  KEY__IN_MEMORY,
  KEY__SYNCHRONIZE,
  KEY__PREFIX
} from './database.config-constants';
import { DatabaseModuleConfig } from './database.config-descriptor';

export interface DatabaseConfigFactory extends BaseModuleOptionsFactory<DatabaseModuleConfig> {}

export class DatabaseModuleConfigFactoryImpl extends AbstractModuleOptionsFactory<DatabaseModuleConfig> implements DatabaseConfigFactory {

  constructor(config: ConfigService) {
    super(config, DATABASE_CONFIG_PREFIX);
  }

  createOptions(): Promise<DatabaseModuleConfig> | DatabaseModuleConfig {
    return {
      type: this.readConfig(KEY__TYPE),
      host: this.readConfig(KEY__HOST),
      username: this.readConfig(KEY__USERNAME),
      password: this.readConfig(KEY__PASSWORD),
      name: this.readConfig(KEY__NAME),
      port: this.readConfig(KEY__PORT),
      entities: this.readConfig(KEY__ENTITIES),
      migrations: this.readConfig(KEY__MIGRATIONS),
      migrationsRun: this.readConfig(KEY__MIGRATIONS_RUN),
      migrationsDir: this.readConfig(KEY__MIGRATIONS_DIR),
      inMemory: this.readConfig(KEY__IN_MEMORY),
      synchronize: this.readConfig(KEY__SYNCHRONIZE),
      // testing only keys
      prefix: this.readConfig(KEY__PREFIX),
    };
  }
}
