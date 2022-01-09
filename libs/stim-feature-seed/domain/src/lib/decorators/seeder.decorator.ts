import { Type } from '@nestjs/common';

import { SEEDER_METADATA } from './constants';

export const Seeder = (entity: Type<unknown>): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(SEEDER_METADATA, entity, target);
  };
};
