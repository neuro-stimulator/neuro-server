import { BroadcastHandler } from './handlers/broadcast.handler';
import { PublishClientReadyHandler } from './handlers/publish-client-ready.handler';
import { SendHandler } from './handlers/send.handler';

export const SocketCommands = [SendHandler, BroadcastHandler, PublishClientReadyHandler];
