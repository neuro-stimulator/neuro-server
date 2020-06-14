import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentNameExistsQuery } from '../impl/experiment-name-exists.query';

@QueryHandler(ExperimentNameExistsQuery)
export class ExperimentNameExistsHandler
  implements IQueryHandler<ExperimentNameExistsQuery, boolean> {
  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentNameExistsQuery): Promise<boolean> {
    return this.service.nameExists(query.name, query.expeirmentID);
  }
}
