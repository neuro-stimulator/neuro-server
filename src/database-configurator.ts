import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatabaseConfigurator implements TypeOrmOptionsFactory {

  private static readonly BASE_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true
  };

  private static readonly DEVELOPMENT_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.dev.sqlite',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true
  };

  private static readonly TESTING_DATABASE_CONFIGURATION: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.qa.sqlite',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true
  };

  private readonly logger: Logger = new Logger(DatabaseConfigurator.name);

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    console.log(process.env);
    if (process.env.PRODUCTION === 'true') {
      this.logger.log(`Používám produkční databázi: '${DatabaseConfigurator.BASE_DATABASE_CONFIGURATION.database}'`);
      return DatabaseConfigurator.BASE_DATABASE_CONFIGURATION;
    }
    if (process.env.TESTING === 'true') {
      this.logger.log(`Používám testovací databázi: '${DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION.database}'`);
      return DatabaseConfigurator.TESTING_DATABASE_CONFIGURATION;
    }

    this.logger.log(`Používám vývojovou databázi: '${DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION.database}'`);
    return DatabaseConfigurator.DEVELOPMENT_DATABASE_CONFIGURATION;
  }

}
