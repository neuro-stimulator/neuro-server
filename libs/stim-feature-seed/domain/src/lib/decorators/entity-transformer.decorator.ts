import { Type } from '@nestjs/common';

import { ENTITY_TRANSFORMER_METADATA } from './constants';

export const EntityTransformer = (entity: Type<unknown>): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(ENTITY_TRANSFORMER_METADATA, entity, target);
  };
};
