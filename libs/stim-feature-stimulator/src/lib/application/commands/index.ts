import { OpenHandler } from './handlers/open.handler';
import { CloseHandler } from './handlers/close.handler';
import { FirmwareUpdateHandler } from './handlers/firmware-update.handler';
import { ExperimentClearHandler } from './handlers/experiment-clear.handler';
import { ExperimentFinishHandler } from './handlers/experiment-finish.handler';
import { ExperimentPauseHandler } from './handlers/experiment-pause.handler';
import { ExperimentRunHandler } from './handlers/experiment-run.handler';
import { ExperimentSetupHandler } from './handlers/experiment-setup.handler';
import { ExperimentUploadHandler } from './handlers/experiment-upload.handler';
import { SequenceNextPartHandler } from './handlers/sequence-next-part.handler';
import { SaveSerialPathIfNecessaryHandler } from './handlers/save-serial-path-if-necessary.handler';
import { FirmwareFileDeleteHandler } from './handlers/firmware-file-delete.handler';
import { SendStimulatorStateChangeToIpcHandler } from './handlers/to-ipc/send-stimulator-state-change-to-ipc.handler';
import { SendStimulatorIoDataToClientHandler } from './handlers/to-client/send-stimulator-io-data-to-client.handler';
import { StimulatorStateHandler } from './handlers/stimulator-state.handler';
import { SendStimulatorConnectedToClientHandler } from './handlers/to-client/send-stimulator-connected-to-client.handler';
import { SendStimulatorDisconnectedToClientHandler } from './handlers/to-client/send-stimulator-disconnected-to-client.handler';
import { SendStimulatorStateChangeToClientHandler } from './handlers/to-client/send-stimulator-state-change-to-client.handler';

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
  SendStimulatorIoDataToClientHandler,
  SendStimulatorStateChangeToClientHandler,
  SendStimulatorConnectedToClientHandler,
  SendStimulatorDisconnectedToClientHandler,
];

export * from './impl/open.command';
export * from './impl/close.command';
export * from './impl/firmware-update.command';
export * from './impl/experiment-clear.command';
export * from './impl/experiment-finish.command';
export * from './impl/experiment-pause.command';
export * from './impl/experiment-run.command';
export * from './impl/experiment-setup.command';
export * from './impl/experiment-upload.command';
export * from './impl/sequence-next-part.command';
export * from './impl/save-serial-path-if-necessary.command';
export * from './impl/firmware-file-delete.command';
export * from './impl/stimulator-state.command';
export * from './impl/to-ipc/send-stimulator-state-change-to-ipc.command';
export * from './impl/to-client/send-stimulator-state-change-to-client.command';
export * from './impl/to-client/send-stimulator-connected-to-client.command';
