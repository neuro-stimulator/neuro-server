import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultsAllQuery } from '../impl/experiment-results-all.query';

@QueryHandler(ExperimentResultsAllQuery)
export class ExperimentResultsAllHandler implements IQueryHandler<ExperimentResultsAllQuery> {
  private readonly logger: Logger = new Logger(ExperimentResultsAllHandler.name);

  constructor(private readonly service: ExperimentResultsService) {}

  execute(query: ExperimentResultsAllQuery): Promise<ExperimentResult[]> {
    this.logger.debug('Budu vyhledávat všechny výsledky experimentů.');
    return this.service.findAll({ userGroups: query.userGroups });
  }
}
