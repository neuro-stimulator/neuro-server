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
import { SendStimulatorDataToClientHandler } from './handlers/send-stimulator-data-to-client.handler';

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
  SendStimulatorDataToClientHandler,
];

export * from './handlers/open.handler';
export * from './handlers/close.handler';
export * from './handlers/firmware-update.handler';
export * from './handlers/firmware-update.handler';
export * from './handlers/experiment-clear.handler';
export * from './handlers/experiment-finish.handler';
export * from './handlers/experiment-pause.handler';
export * from './handlers/experiment-run.handler';
export * from './handlers/experiment-setup.handler';
export * from './handlers/experiment-upload.handler';
export * from './handlers/sequence-next-part.handler';
export * from './handlers/send-stimulator-data-to-client.handler';

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
