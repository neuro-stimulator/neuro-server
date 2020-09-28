import { Injectable } from '@nestjs/common';

import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionRepository } from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class StopConditionsService {
  constructor(private readonly repository: ExperimentStopConditionRepository) {}

  public async stopConditionsForExperimentType(experimentType: ExperimentType): Promise<ExperimentStopConditionType[]> {
    return this.repository.byExperimentType(experimentType);
  }
}
