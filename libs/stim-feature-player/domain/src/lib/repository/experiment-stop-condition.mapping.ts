import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';

export function entityToExperimentStopConditionType(entity: ExperimentStopConditionEntity): ExperimentStopConditionType {
  return ExperimentStopConditionType[entity.experimentStopConditionType];
}

export function experimentStopConditionTypeToEntity(experimentType: ExperimentType, stopCondition: ExperimentStopConditionType): ExperimentStopConditionEntity {
  const entity = new ExperimentStopConditionEntity();

  entity.experimentType = ExperimentType[experimentType];
  entity.experimentStopConditionType = ExperimentStopConditionType[stopCondition];

  return entity;
}
