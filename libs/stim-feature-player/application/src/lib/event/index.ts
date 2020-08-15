import { PlayerExperimentResultWasInitializedHandler } from './handlers/player-experiment-result-was-initialized.handler';
import { PlayerExperimentClearedHandler } from './handlers/player-experiment-cleared.handler';
import { PlayerExperimentInitializedHandler } from './handlers/player-experiment-initialized.handler';
import { PlayerExperimentFinishedHandler } from './handlers/player-experiment-finished.handler';
import { PlayerClientConnectedHandler } from './handlers/player-client-connected.handler';

export const EventHandlers = [
  PlayerExperimentResultWasInitializedHandler,
  PlayerExperimentClearedHandler,
  PlayerExperimentFinishedHandler,
  PlayerExperimentInitializedHandler,
  PlayerClientConnectedHandler,
];
