import { Type } from '@nestjs/common';

import { SeederService } from './seeder-service';
import { EntityTransformerService } from './entity-transformer-service';

export interface SeederInformation {
  entity: Type<unknown>;
  services: SeederService<unknown>[];
  order: number;
  transformer?: EntityTransformerService;
}
