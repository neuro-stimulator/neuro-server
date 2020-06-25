import { IQuery } from '@nestjs/cqrs';

import { FindManyOptions } from 'typeorm';

import { ExperimentEntity } from '../../../domain/model/entity/experiment.entity';

export class ExperimentsFilteredQuery implements IQuery {
  constructor(public readonly filter: FindManyOptions<ExperimentEntity>) {}
}
