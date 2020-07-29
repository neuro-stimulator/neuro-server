export interface OutputCountingExperimentEndConditionParams {
  maxOutput: number;
}

export type ExperimentEndConditionParams = {} | OutputCountingExperimentEndConditionParams;
