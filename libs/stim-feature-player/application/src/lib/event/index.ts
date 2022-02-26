import { IpcOutputSynchronizationUpdatedHandler } from './handlers/ipc-output-synchronization-updated.handler';
import { PlayerBlockingCommandFailedHandler } from './handlers/player-blocking-command-failed.handler';
import { PlayerClientReadyHandler } from './handlers/player-client-ready.handler';
import { PlayerExperimentClearedHandler } from './handlers/player-experiment-cleared.handler';
import { PlayerExperimentFinishedHandler } from './handlers/player-experiment-finished.handler';
import { PlayerExperimentInitializedHandler } from './handlers/player-experiment-initialized.handler';
import { PlayerExperimentResultWasInitializedHandler } from './handlers/player-experiment-result-was-initialized.handler';

export const EventHandlers = [
  PlayerExperimentResultWasInitializedHandler,
  PlayerExperimentClearedHandler,
  PlayerExperimentFinishedHandler,
  PlayerExperimentInitializedHandler,
  PlayerClientReadyHandler,
  PlayerBlockingCommandFailedHandler,
  IpcOutputSynchronizationUpdatedHandler,
];
