import * as path from 'path';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { DatabaseModuleConfig, DATABASE_MODULE_CONFIG_CONSTANT } from './config';
import { ENTITIES } from './generated/entities-index';

@Injectable()
export class DatabaseConfigurator implements TypeOrmOptionsFactory {

  private readonly logger: Logger = new Logger(DatabaseConfigurator.name);

  private readonly DATABASE_ROOT = process.env['fileBrowser.appDataRoot'];
  private readonly PRODUCTION = process.env['production'];
  private readonly TESTING = process.env['testing'];

  constructor(@Inject(DATABASE_MODULE_CONFIG_CONSTANT) private readonly config: DatabaseModuleConfig) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: this.decideDatabaseName(),
      entities: Object.values(ENTITIES),
      synchronize: true,
      host: this.config.host,
      username: this.config.username,
      password: this.config.password,
      port: this.config.port,
      migrations: this.config.migrations ? [path.join(this.DATABASE_ROOT, this.config.migrations)] : [],
      cli: {
        migrationsDir: this.config.migrationsDir,
      },
    } as TypeOrmModuleOptions;
  }

  protected decideDatabaseName(): string {
    if (this.config.inMemory) {
      this.logger.log('Databáze bude uložená pouze v paměti.')
      return ':memory:';
    }

    const databasePath = path.join(
      this.DATABASE_ROOT,
      `${this.config.prefix ? this.config.prefix + '_' : ''}${this.config.name}${this.decideSuffixByEntironment()}.sqlite`);
    this.logger.log(`Cesta k databázi: ${databasePath}.`);
    return databasePath;
  }

  protected decideSuffixByEntironment(): string {
    if (this.PRODUCTION === 'true') {
      this.logger.log('Používám produkční databázi...');
      return '';
    }
    if (this.TESTING === 'true') {
      this.logger.log('Používám testovací databázi...');
      return '.qa';
    }
    this.logger.log('Používám vývojovou databázi...');
    return '.dev';
  }
}
