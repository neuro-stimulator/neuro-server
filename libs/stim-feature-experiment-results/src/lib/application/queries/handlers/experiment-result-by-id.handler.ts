import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { ExperimentResultIdNotFoundError } from '../../../domain/exception/experiment-result-id-not-found.error';
import { ExperimentResultByIdQuery } from '../impl/experiment-result-by-id.query';

@QueryHandler(ExperimentResultByIdQuery)
export class ExperimentResultByIdHandler
  implements IQueryHandler<ExperimentResultByIdQuery, ExperimentResult> {
  constructor(private readonly service: ExperimentResultsService) {}

  async execute(query: ExperimentResultByIdQuery): Promise<ExperimentResult> {
    const experimentResult = await this.service.byId(query.experimentResultID);
    if (!experimentResult) {
      throw new ExperimentResultIdNotFoundError(query.experimentResultID);
    }

    return experimentResult;
  }
}
