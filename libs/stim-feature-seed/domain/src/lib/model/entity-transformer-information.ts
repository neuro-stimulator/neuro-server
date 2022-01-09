import { Type } from '@nestjs/common';

import { EntityTransformerService } from './entity-transformer-service';

export interface EntityTransformerInformation {
    entity: Type<unknown>;
    transformer: EntityTransformerService;
}
