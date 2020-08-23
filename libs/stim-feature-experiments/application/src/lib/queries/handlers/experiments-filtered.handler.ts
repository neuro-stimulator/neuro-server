import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../services/experiments.service';
import { ExperimentsFilteredQuery } from '../impl/experiments-filtered.query';

@QueryHandler(ExperimentsFilteredQuery)
export class ExperimentsFilteredHandler implements IQueryHandler<ExperimentsFilteredQuery, Experiment[]> {
  constructor(private readonly service: ExperimentsService) {}

  execute(query: ExperimentsFilteredQuery): Promise<Experiment[]> {
    const filter = query.filter;
    filter.where = filter.where || {};
    filter.where['userId'] = query.userID;
    return this.service.findAll(query.filter);
  }
}
