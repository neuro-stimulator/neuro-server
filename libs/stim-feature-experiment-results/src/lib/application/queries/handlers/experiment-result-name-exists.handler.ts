import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { ExperimentResultNameExistsQuery } from '../impl/experiment-result-name-exists.query';

@QueryHandler(ExperimentResultNameExistsQuery)
export class ExperimentResultNameExistsHandler
  implements IQueryHandler<ExperimentResultNameExistsQuery, boolean> {
  constructor(private readonly service: ExperimentResultsService) {}

  async execute(query: ExperimentResultNameExistsQuery): Promise<boolean> {
    return this.service.nameExists(query.name, query.expeirmentResultID);
  }
}
