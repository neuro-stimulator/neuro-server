import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isBooleanString, isNumberString } from '@nestjs/class-validator';

import { BaseModuleOptions, BaseModuleOptionsFactory } from './interfaces';
import { ConfigKey, DynamicConfigKeyProvider, PrimitiveType } from './config-key';

export abstract class AbstractModuleOptionsFactory<O extends BaseModuleOptions> implements BaseModuleOptionsFactory<O> {

  protected readonly logger: Logger = new Logger(AbstractModuleOptionsFactory.name);

  protected constructor(private readonly config: ConfigService, private readonly prefix?: string) {}

  abstract createOptions(): Promise<O> | O;

  protected readDynamicConfig<T extends PrimitiveType = string>(provideKey: DynamicConfigKeyProvider<T>, dynamicPart: string): any {
    return this.readConfig(provideKey(dynamicPart));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readConfig<T extends PrimitiveType = string>(key: ConfigKey<T>): any {
    let keyName = key.name;
    if (this.prefix !== undefined) {
      keyName = `${this.prefix}.${keyName}`;
    }
    const value = this.config.get<T>(keyName);
    this.logger.log(`Klíč: ${keyName}=${(value !== undefined) ? value : key.defaultValue} (${key.type.name.toLowerCase()})`);

    if (value === undefined) {
      if (key.use === 'required') {
        this.logger.error(`Klíč ${key.name} nemá žádnou hodnotu, ale je vyžadován!`);
        process.exit(5);
      }

      if (key.isArray) {
        const separator = key.separator;
        return (key.defaultValue as string || '').split(separator).map((val: string) => this.resolveValue(key, val)).filter((val: string) => !!val);
      }
      return key.defaultValue;
    }

    if (key.restriction !== undefined && key.restriction.length > 0) {
      if (!key.restriction.includes(value)) {
        this.logger.error(`Klíč ${key.name} je omezen na hodnoty: ${key.restriction.join(',')}. Aktuální hodnota: ${value}.`);
        process.exit(6);
      }
    }

    if (key.isArray) {
      const separator = key.separator;
      return (value as string).split(separator).map((val: string) => this.resolveValue(key, val));
    } else {
      return this.resolveValue(key, value);
    }
  }

  private resolveValue<T extends PrimitiveType>(key: ConfigKey<T>, value) {
    switch (key.type.name.toLowerCase()) {
      case 'string':
        return value;
      case 'number':
        if (isNumberString(value)) {
          return Number(value);
        } else {
          this.showUnexpectedDataTypeMessage(value, key);
        }
        break;
      case 'boolean':
        if (isBooleanString(value)) {
          return value === 'true' || value === '1';
        } else {
          this.showUnexpectedDataTypeMessage(value, key);
        }
        break;
      default:
        this.logger.error('Hodnota neodpovídá žádnému podporovanému typu. Ukončuji aplikaci!');
        process.exit(8);
        throw new Error();
    }
  }

  private showUnexpectedDataTypeMessage<T extends PrimitiveType>(value: T, key: ConfigKey<T>) {
    this.logger.error(`Klíč s hodnotou: ${value} neodpovídá očekávánému datovému typu! Aktuální: ${typeof value} - očekávaný: ${key.type.name.toLowerCase()}!`);
    process.exit(7);
  }

}
