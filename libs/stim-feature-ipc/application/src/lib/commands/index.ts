import { IpcCloseHandler } from './handlers/ipc-close.handler';
import { IpcOpenHandler } from './handlers/ipc-open.handler';
import { IpcSendStimulatorStateChangeHandler } from './handlers/ipc-send-stimulator-state-change.handler';
import { IpcSetExperimentAssetHandler } from './handlers/ipc-set-experiment-asset.handler';
import { IpcSetOutputSynchronizationHandler } from './handlers/ipc-set-output-synchronization.handler';
import { IpcSetPublicPathHandler } from './handlers/ipc-set-public-path.handler';
import { IpcToggleOutputHandler } from './handlers/ipc-toggle-output.handler';
import { IpcUpdateOutputDataHandler } from './handlers/ipc-update-output-data.handler';
import { IpcSpawnHandler } from './handlers/ipc-spawn.handler';
import { IpcKillHandler } from './handlers/ipc-kill.handler';

export const CommandHandlers = [
  IpcCloseHandler,
  IpcOpenHandler,
  IpcSendStimulatorStateChangeHandler,
  IpcSetExperimentAssetHandler,
  IpcSetOutputSynchronizationHandler,
  IpcSetPublicPathHandler,
  IpcToggleOutputHandler,
  IpcUpdateOutputDataHandler,
  IpcSpawnHandler,
  IpcKillHandler,
];
