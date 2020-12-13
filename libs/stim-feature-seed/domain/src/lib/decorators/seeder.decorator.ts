import { SEEDER_METADATA } from './constants';

export const Seeder = (entity): ClassDecorator => {
  return (target: unknown) => {
    Reflect.defineMetadata(SEEDER_METADATA, entity, target);
  };
};
