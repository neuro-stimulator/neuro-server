import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { ExperimentStopCondition } from '../experiment-stop-condition/experiment-stop-condition';

export interface PlayerLocalConfiguration extends PlayerConfiguration {
  userID: number;
}
