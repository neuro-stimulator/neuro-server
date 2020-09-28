import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentStopConditionType } from '@stechy1/diplomka-share';

import { StopConditionTypesQuery } from '../impl/stop-condition-types.query';

import { StopConditionsService } from '../../service/stop-conditions.service';

@QueryHandler(StopConditionTypesQuery)
export class StopConditionTypesHandler implements IQueryHandler<StopConditionTypesQuery, ExperimentStopConditionType[]> {
  private readonly logger: Logger = new Logger(StopConditionTypesHandler.name);

  constructor(private readonly service: StopConditionsService) {}

  async execute(query: StopConditionTypesQuery): Promise<ExperimentStopConditionType[]> {
    this.logger.debug('Budu vyhledávat všechny zastavovací podmínky pro typ experimentu: ' + query.experimentType);
    return this.service.stopConditionsForExperimentType(query.experimentType);
  }
}
