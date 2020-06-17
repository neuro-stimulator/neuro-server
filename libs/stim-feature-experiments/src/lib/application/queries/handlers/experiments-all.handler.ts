import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsAllQuery } from '../impl/experiments-all.query';
import { ExperimentsService } from '../../../domain/services/experiments.service';

@QueryHandler(ExperimentsAllQuery)
export class ExperimentsAllHandler
  implements IQueryHandler<ExperimentsAllQuery, Experiment[]> {
  constructor(private readonly service: ExperimentsService) {}

  execute(query: ExperimentsAllQuery): Promise<Experiment[]> {
    return this.service.findAll();
  }
}
