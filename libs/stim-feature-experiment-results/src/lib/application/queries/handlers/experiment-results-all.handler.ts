import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { ExperimentResultsAllQuery } from '../impl/experiment-results-all.query';

@QueryHandler(ExperimentResultsAllQuery)
export class ExperimentResultsAllHandler
  implements IQueryHandler<ExperimentResultsAllQuery> {
  constructor(private readonly service: ExperimentResultsService) {}

  execute(query: ExperimentResultsAllQuery): Promise<ExperimentResult[]> {
    return this.service.findAll();
  }
}
