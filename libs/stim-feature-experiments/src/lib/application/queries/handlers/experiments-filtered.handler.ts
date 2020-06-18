import { IQueryHandler } from '@nestjs/cqrs';
import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentsFilteredQuery } from '../impl/experiments-filtered.query';

export class ExperimentsFilteredHandler
  implements IQueryHandler<ExperimentsFilteredQuery, Experiment[]> {
  constructor(private readonly service: ExperimentsService) {}

  execute(query: ExperimentsFilteredQuery): Promise<Experiment[]> {
    return this.service.findAll(query.filter);
  }
}
