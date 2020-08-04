import { ExperimentStopCondition } from '@diplomka-backend/stim-feature-player/domain';

export interface PlayerLocalConfiguration {
  initialized: boolean;
  experimentRepeat: number;
  betweenExperimentInterval: number;
  experimentStopCondition: ExperimentStopCondition;
  autoplay: boolean;
  isBreakTime: boolean;
}
