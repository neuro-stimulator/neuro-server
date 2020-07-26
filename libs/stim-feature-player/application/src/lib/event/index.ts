import { ExperimentResultWasInitializedHandler } from './handlers/experiment-result-was-initialized.handler';
import { ExperimentClearedHandler } from './handlers/experiment-cleared.handler';
import { ExperimentInitializedHandler } from './handlers/experiment-initialized.handler';
import { ExperimentFinishedHandler } from './handlers/experiment-finished.handler';
import { PlayerClientConnectedHandler } from './handlers/player-client-connected.handler';

export const EventHandlers = [
  ExperimentResultWasInitializedHandler,
  ExperimentClearedHandler,
  ExperimentFinishedHandler,
  ExperimentInitializedHandler,
  PlayerClientConnectedHandler,
];
