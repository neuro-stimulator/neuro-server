import { ExperimentEndConditionParams } from '@diplomka-backend/stim-feature-player/domain';

export class PlayerConfigurationDTO {
  repeat: number;
  betweenExperimentInterval: number;
  stopConditions: ExperimentEndConditionParams;
}
