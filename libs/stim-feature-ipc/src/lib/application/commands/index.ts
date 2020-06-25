import { IpcCloseHandler } from './handlers/ipc-close-handler';
import { IpcOpenHandler } from './handlers/ipc-open.handler';
import { IpcStimulatorStateChangeHandler } from './handlers/ipc-stimulator-state-change.handler';
import { SendIpcStateToClientHandler } from './handlers/send-ipc-state-to-client.handler';

export const CommandHandlers = [
  IpcCloseHandler,
  IpcOpenHandler,
  IpcStimulatorStateChangeHandler,
  SendIpcStateToClientHandler,
];
