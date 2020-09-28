import { CycleCountingExperimentStopConditionParams, ExperimentStopConditionType, IOEvent } from '@stechy1/diplomka-share';

import { ExperimentStopCondition } from '@diplomka-backend/stim-feature-player/domain';

export class CycleCountingExperimentStopCondition implements ExperimentStopCondition {
  readonly stopConditionType: ExperimentStopConditionType = ExperimentStopConditionType.COUNTING_CYCLE_STOP_CONDITION;

  constructor(public readonly stopConditionParams: CycleCountingExperimentStopConditionParams) {}

  canContinue(ioData: IOEvent[], experimentIoData: IOEvent[][]): boolean {
    return experimentIoData.length <= this.stopConditionParams.cycleCount;
  }
}
