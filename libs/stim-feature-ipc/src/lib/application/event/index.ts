import { IpcClosedHandler } from './handlers/ipc-closed.handler';
import { IpcConnectedHandler } from './handlers/ipc-connected.handler';
import { IpcDisconnectedHandler } from './handlers/ipc-disconnected.handler';
import { IpcErrorHandler } from './handlers/ipc-error.handler';
import { IpcListeningHandler } from './handlers/ipc-listening.handler';
import { IpcMessageHandler } from './handlers/ipc-message.handler';
import { IpcWasOpenHandler } from './handlers/ipc-was-open.handler';
import { IpcSettingsLoadedHandler } from './handlers/ipc-settings-loaded.handler';

export const EventHandlers = [
  IpcClosedHandler,
  IpcConnectedHandler,
  IpcDisconnectedHandler,
  IpcErrorHandler,
  IpcListeningHandler,
  IpcMessageHandler,
  IpcWasOpenHandler,
  IpcSettingsLoadedHandler,
];
