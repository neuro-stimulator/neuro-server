import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../services/experiments.service';
import { ExperimentByIdQuery } from '../impl/experiment-by-id.query';

@QueryHandler(ExperimentByIdQuery)
export class ExperimentByIdHandler implements IQueryHandler<ExperimentByIdQuery, Experiment> {
  private readonly logger: Logger = new Logger(ExperimentByIdHandler.name);

  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentByIdQuery): Promise<Experiment> {
    this.logger.debug('Budu hledat experiment podle ID.');
    return this.service.byId(query.experimentID, query.userID);
  }
}
