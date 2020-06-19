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

export * from './handlers/ipc-close-handler';
export * from './handlers/ipc-open.handler';
export * from './handlers/ipc-stimulator-state-change.handler';
export * from './handlers/send-ipc-state-to-client.handler';

export * from './impl/ipc-open.command';
export * from './impl/ipc-close.command';
export * from './impl/ipc-stimulator-state-change.command';
export * from './impl/send-ipc-state-to-client.command';
