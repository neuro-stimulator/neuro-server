import { ConnectionClientReadyHandler } from './handlers/connection-client-ready.handler';
import { ConnectionIpcClientConnectedHandler } from './handlers/connection-ipc-client-connected.handler';
import { ConnectionIpcClientDisconnectedHandler } from './handlers/connection-ipc-client-disconnected.handler';

export const EventHandlers = [ConnectionClientReadyHandler, ConnectionIpcClientConnectedHandler, ConnectionIpcClientDisconnectedHandler];
