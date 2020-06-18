import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { ExperimentEntity } from '@diplomka-backend/stim-feature-experiments';

export class ExperimentsFilteredQuery implements IQuery {
  constructor(public readonly filter: FindManyOptions<ExperimentEntity>) {}
}
