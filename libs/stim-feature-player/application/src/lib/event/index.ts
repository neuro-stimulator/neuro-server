import { PlayerExperimentResultWasInitializedHandler } from './handlers/player-experiment-result-was-initialized.handler';
import { PlayerExperimentClearedHandler } from './handlers/player-experiment-cleared.handler';
import { PlayerExperimentInitializedHandler } from './handlers/player-experiment-initialized.handler';
import { PlayerExperimentFinishedHandler } from './handlers/player-experiment-finished.handler';
import { PlayerClientReadyHandler } from './handlers/player-client-ready.handler';
import { PlayerBlockingCommandFailedHandler } from './handlers/player-blocking-command-failed.handler';

export const EventHandlers = [
  PlayerExperimentResultWasInitializedHandler,
  PlayerExperimentClearedHandler,
  PlayerExperimentFinishedHandler,
  PlayerExperimentInitializedHandler,
  PlayerClientReadyHandler,
  PlayerBlockingCommandFailedHandler,
];
