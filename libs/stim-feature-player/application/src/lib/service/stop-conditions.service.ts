import { Injectable, Logger } from '@nestjs/common';

import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionRepository } from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class StopConditionsService {
  private readonly logger: Logger = new Logger(StopConditionsService.name);

  constructor(private readonly repository: ExperimentStopConditionRepository) {}

  public async stopConditionsForExperimentType(experimentType: ExperimentType): Promise<ExperimentStopConditionType[]> {
    return this.repository.byExperimentType(experimentType);
  }

  public async insert(experimentType: ExperimentType, stopCondition: ExperimentStopConditionType): Promise<number> {
    this.logger.verbose('Vkládám novou zastavovací podmínku pro typ experimentu do databáze.');
    const result = await this.repository.insert(experimentType, stopCondition);
    return result.raw;
  }
}
