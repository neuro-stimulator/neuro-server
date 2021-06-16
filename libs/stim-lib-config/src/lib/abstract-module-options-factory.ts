import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseModuleOptions, BaseModuleOptionsFactory } from './interfaces';
import { ConfigKey, PrimitiveType } from './config-key';

export abstract class AbstractModuleOptionsFactory<O extends BaseModuleOptions> implements BaseModuleOptionsFactory<O> {

  private readonly logger: Logger = new Logger(AbstractModuleOptionsFactory.name);

  protected constructor(private readonly config: ConfigService, private readonly prefix?: string) {}

  abstract createOptions(): Promise<O> | O;

  protected readConfig<T extends PrimitiveType>(key: ConfigKey<T>) {
    let keyName = key.name;
    if (this.prefix !== undefined) {
      keyName = `${this.prefix}.${keyName}`;
    }
    const value = this.config.get<T>(keyName);

    if (value === undefined) {
      if (key.use === 'required') {
        this.logger.error(`Klíč ${key.name} nemá žádnou hodnotu, ale je vyžadován!`);
        process.exit(5);
      }

      return key.defaultValue;
    }

    if (typeof value !== key.type.name.toLowerCase()) {
      this.logger.error(`Klíč s hodnotou: ${value} neodpovídá očekávánému datovému typu! Aktuální: ${typeof value} - očekávaný: ${key.type}!`);
      process.exit(6);
    }

    return value;
  }
}
