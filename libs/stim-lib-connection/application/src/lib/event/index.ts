import { ConnectionClientConnectedHandler } from './handlers/connection-client-connected.handler';
import { ConnectionIpcClientConnectedHandler } from './handlers/connection-ipc-client-connected.handler';
import { ConnectionIpcClientDisconnectedHandler } from './handlers/connection-ipc-client-disconnected.handler';

export const EventHandlers = [ConnectionClientConnectedHandler, ConnectionIpcClientConnectedHandler, ConnectionIpcClientDisconnectedHandler];
