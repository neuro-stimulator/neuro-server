import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultIdNotFoundError } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultByIdQuery } from '../impl/experiment-result-by-id.query';

@QueryHandler(ExperimentResultByIdQuery)
export class ExperimentResultByIdHandler implements IQueryHandler<ExperimentResultByIdQuery, ExperimentResult> {
  constructor(private readonly service: ExperimentResultsService) {}

  async execute(query: ExperimentResultByIdQuery): Promise<ExperimentResult> {
    const experimentResult = await this.service.byId(query.experimentResultID);
    if (!experimentResult) {
      throw new ExperimentResultIdNotFoundError(query.experimentResultID);
    }

    return experimentResult;
  }
}
