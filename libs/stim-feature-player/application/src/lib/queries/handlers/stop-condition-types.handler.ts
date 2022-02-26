import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentStopConditionType } from '@stechy1/diplomka-share';

import { StopConditionsService } from '../../service/stop-conditions.service';
import { StopConditionTypesQuery } from '../impl/stop-condition-types.query';

@QueryHandler(StopConditionTypesQuery)
export class StopConditionTypesHandler implements IQueryHandler<StopConditionTypesQuery, ExperimentStopConditionType[]> {
  private readonly logger: Logger = new Logger(StopConditionTypesHandler.name);

  constructor(private readonly service: StopConditionsService) {}

  async execute(query: StopConditionTypesQuery): Promise<ExperimentStopConditionType[]> {
    this.logger.debug('Budu vyhledávat všechny zastavovací podmínky pro typ experimentu: ' + query.experimentType);
    const stopConditionTypes: ExperimentStopConditionType[] = await this.service.stopConditionsForExperimentType(query.experimentType);
    if (stopConditionTypes.length === 0) {
      this.logger.debug('Nebyly nalezeny žádné zastavovací podmínky.');
    } else {
      this.logger.debug('Byly nalezeny následující zastavovací podmínky: ' + stopConditionTypes.join(','));
    }
    return stopConditionTypes;
  }
}
