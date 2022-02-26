import { CheckStimulatorStateConsistencyHandler } from './handlers/check-stimulator-state-consistency.handler';
import { CloseHandler } from './handlers/close.handler';
import { ExperimentClearHandler } from './handlers/experiment-clear.handler';
import { ExperimentFinishHandler } from './handlers/experiment-finish.handler';
import { ExperimentPauseHandler } from './handlers/experiment-pause.handler';
import { ExperimentRunHandler } from './handlers/experiment-run.handler';
import { ExperimentSetupHandler } from './handlers/experiment-setup.handler';
import { ExperimentUploadHandler } from './handlers/experiment-upload.handler';
import { FirmwareFileDeleteHandler } from './handlers/firmware-file-delete.handler';
import { FirmwareUpdateHandler } from './handlers/firmware-update.handler';
import { OpenHandler } from './handlers/open.handler';
import { SaveSerialPathIfNecessaryHandler } from './handlers/save-serial-path-if-necessary.handler';
import { SequenceNextPartHandler } from './handlers/sequence-next-part.handler';
import { StimulatorSetOutputHandler } from './handlers/stimulator-set-output.handler';
import { StimulatorStateHandler } from './handlers/stimulator-state.handler';
import { SendStimulatorConnectedToClientHandler } from './handlers/to-client/send-stimulator-connected-to-client.handler';
import { SendStimulatorDisconnectedToClientHandler } from './handlers/to-client/send-stimulator-disconnected-to-client.handler';
import { SendStimulatorStateChangeToClientHandler } from './handlers/to-client/send-stimulator-state-change-to-client.handler';
import { SendStimulatorStateChangeToIpcHandler } from './handlers/to-ipc/send-stimulator-state-change-to-ipc.handler';

export const SerialHandlers = [
  OpenHandler,
  CloseHandler,
  FirmwareUpdateHandler,
  ExperimentClearHandler,
  ExperimentFinishHandler,
  ExperimentPauseHandler,
  ExperimentRunHandler,
  ExperimentSetupHandler,
  ExperimentUploadHandler,
  SequenceNextPartHandler,
  SaveSerialPathIfNecessaryHandler,
  FirmwareFileDeleteHandler,
  StimulatorStateHandler,
  SendStimulatorStateChangeToIpcHandler,
  SendStimulatorStateChangeToClientHandler,
  SendStimulatorConnectedToClientHandler,
  SendStimulatorDisconnectedToClientHandler,
  StimulatorSetOutputHandler,
  CheckStimulatorStateConsistencyHandler,
];
