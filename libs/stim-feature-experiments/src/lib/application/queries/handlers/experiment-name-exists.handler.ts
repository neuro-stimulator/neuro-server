import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentNameExistsQuery } from '../impl/experiment-name-exists.query';

@QueryHandler(ExperimentNameExistsQuery)
export class ExperimentNameExistsHandler implements IQueryHandler<ExperimentNameExistsQuery, boolean> {
  private readonly logger: Logger = new Logger(ExperimentNameExistsHandler.name);

  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentNameExistsQuery): Promise<boolean> {
    this.logger.debug('Budu testovat existenci názvu experimentu.');
    return this.service.nameExists(query.name, query.expeirmentID);
  }
}
