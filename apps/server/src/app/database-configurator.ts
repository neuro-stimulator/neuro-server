import * as path from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { ENTITIES } from './database/entities-index';
import { environment } from '../environments/environment';

@Injectable()
export class DatabaseConfigurator implements TypeOrmOptionsFactory {
  private static readonly BASE_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(environment.appDataRoot, 'database.sqlite'),
    entities: Object.values(ENTITIES),
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
    migrationsRun: true,
  };

  private static readonly DEVELOPMENT_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(environment.appDataRoot, 'database.dev.sqlite'),
    entities: Object.values(ENTITIES),
    synchronize: true,
  };

  private static readonly TESTING_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.qa.sqlite',
    entities: Object.values(ENTITIES),
    synchronize: true,
  };

  private readonly logger: Logger = new Logger(DatabaseConfigurator.name);

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    if (process.env.PRODUCTION === 'true') {
      this.logger.log(
        `Používám produkční databázi: '${DatabaseConfigurator.BASE_DATABASE_CONFIGURATION.database}'`
      );
      return DatabaseConfigurator.BASE_DATABASE_CONFIGURATION;
    }
    if (process.env.TESTING === 'true') {
      this.logger.log(
        `Používám testovací databázi: '${DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION.database}'`
      );
      return DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION;
    }

    this.logger.log(
      `Používám vývojovou databázi: '${DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION.database}'`
    );
    return DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION;
  }
}
