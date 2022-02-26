import { Type } from '@nestjs/common';

import { EntityTransformerService } from './entity-transformer-service';
import { SeederService } from './seeder-service';

export interface SeederInformation {
  entity: Type<unknown>;
  services: SeederService<unknown>[];
  order: number;
  transformer?: EntityTransformerService;
}
