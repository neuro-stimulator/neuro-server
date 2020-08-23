import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultByIdQuery } from '../impl/experiment-result-by-id.query';

@QueryHandler(ExperimentResultByIdQuery)
export class ExperimentResultByIdHandler implements IQueryHandler<ExperimentResultByIdQuery, ExperimentResult> {
  constructor(private readonly service: ExperimentResultsService) {}

  async execute(query: ExperimentResultByIdQuery): Promise<ExperimentResult> {
    return await this.service.byId(query.experimentResultID, query.userID);
  }
}
