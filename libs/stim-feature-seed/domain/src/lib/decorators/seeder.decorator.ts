import { SEEDER_METADATA } from './constants';
import { Type } from '@nestjs/common';

export const Seeder = (entity: Type<unknown>): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(SEEDER_METADATA, entity, target);
  };
};
