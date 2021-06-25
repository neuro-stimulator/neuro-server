import * as path from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { ENTITIES } from './database/entities-index';

@Injectable()
export class DatabaseConfigurator implements TypeOrmOptionsFactory {

  private static readonly DATABASE_ROOT = process.env['fileBrowser.appDataRoot'];

  private readonly BASE_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(DatabaseConfigurator.DATABASE_ROOT, 'database.sqlite'),
    entities: Object.values(ENTITIES),
    synchronize: false,
    migrations: [path.join(DatabaseConfigurator.DATABASE_ROOT, 'migrations/**/*{.ts,.js}')],
    cli: {
      migrationsDir: 'migrations',
    },
    migrationsRun: true,
  };

  private readonly DEVELOPMENT_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(DatabaseConfigurator.DATABASE_ROOT, 'database.dev.sqlite'),
    entities: Object.values(ENTITIES),
    synchronize: true,
  };

  private readonly TESTING_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(DatabaseConfigurator.DATABASE_ROOT, `${process.env.DATABASE_PREFIX}_database.qa.sqlite`),
    entities: Object.values(ENTITIES),
    synchronize: true,
  };

  private readonly logger: Logger = new Logger(DatabaseConfigurator.name);

  createTypeOrmOptions(): TypeOrmModuleOptions {
    if (process.env.PRODUCTION === 'true') {
      this.logger.log(`Používám produkční databázi: '${this.BASE_DATABASE_CONFIGURATION.database}'`);
      console.log(JSON.stringify(this.BASE_DATABASE_CONFIGURATION));
      return this.BASE_DATABASE_CONFIGURATION;
    }
    if (process.env.TESTING === 'true') {
      process.env.ABSOLUTE_DATABASE_PATH = this.TESTING_DATABASE_CONFIGURATION.database as string;
      this.logger.log(`Používám testovací databázi: '${this.TESTING_DATABASE_CONFIGURATION.database}'`);
      return this.TESTING_DATABASE_CONFIGURATION;
    }

    this.logger.log(`Používám vývojovou databázi: '${this.DEVELOPMENT_DATABASE_CONFIGURATION.database}'`);
    return this.DEVELOPMENT_DATABASE_CONFIGURATION;
  }
}
