import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import * as entities from './database/entities-index';

@Injectable()
export class DatabaseConfigurator implements TypeOrmOptionsFactory {
  private static readonly BASE_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: Object.values(entities),
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migrations',
    },
    migrationsRun: true,
  };

  private static readonly DEVELOPMENT_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.dev.sqlite',
    entities: Object.values(entities),
    synchronize: true,
  };

  private static readonly TESTING_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.qa.sqlite',
    entities: Object.values(entities),
    synchronize: true,
  };

  private readonly logger: Logger = new Logger(DatabaseConfigurator.name);

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    // console.log(process.env);
    if (process.env.PRODUCTION === 'true') {
      this.logger.log(
        `Používám produkční databázi: '${DatabaseConfigurator.BASE_DATABASE_CONFIGURATION.database}'`
      );
      this.logger.debug(DatabaseConfigurator.BASE_DATABASE_CONFIGURATION);
      return DatabaseConfigurator.BASE_DATABASE_CONFIGURATION;
    }
    if (process.env.TESTING === 'true') {
      this.logger.log(
        `Používám testovací databázi: '${DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION.database}'`
      );
      this.logger.debug(DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION);
      return DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION;
    }

    this.logger.log(
      `Používám vývojovou databázi: '${DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION.database}'`
    );
    this.logger.debug(DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION);
    return DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION;
  }
}
