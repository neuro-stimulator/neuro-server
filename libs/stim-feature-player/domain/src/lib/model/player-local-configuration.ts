import { ExperimentStopCondition } from '../experiment-stop-condition/experiment-stop-condition';

export interface PlayerLocalConfiguration {
  initialized: boolean;
  experimentRepeat: number;
  betweenExperimentInterval: number;
  experimentStopCondition: ExperimentStopCondition;
  autoplay: boolean;
  isBreakTime: boolean;
}
