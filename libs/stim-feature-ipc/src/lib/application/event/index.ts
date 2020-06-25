import { IpcClosedHandler } from './handlers/ipc-closed.handler';
import { IpcConnectedHandler } from './handlers/ipc-connected.handler';
import { IpcDisconnectedHandler } from './handlers/ipc-disconnected.handler';
import { IpcErrorHandler } from './handlers/ipc-error.handler';
import { IpcListeningHandler } from './handlers/ipc-listening.handler';
import { IpcMessageHandler } from './handlers/ipc-message.handler';
import { IpcOpenHandler } from './handlers/ipc-open.handler';

export const EventHandlers = [
  IpcClosedHandler,
  IpcConnectedHandler,
  IpcDisconnectedHandler,
  IpcErrorHandler,
  IpcListeningHandler,
  IpcMessageHandler,
  IpcOpenHandler,
];

export * from './impl/ipc-closed.event';
export * from './impl/ipc-connected.event';
export * from './impl/ipc-disconnected.event';
export * from './impl/ipc-error.event';
export * from './impl/ipc-listening.event';
export * from './impl/ipc-message.event';
export * from './impl/ipc-open.event';
