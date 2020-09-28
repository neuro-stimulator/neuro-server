import { ExperimentStopConditionType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';

export function entityToExperimentStopConditionType(entity: ExperimentStopConditionEntity): ExperimentStopConditionType {
  return ExperimentStopConditionType[entity.experimentStopConditionType];
}
