import { SendHandler } from './handlers/send.handler';
import { BroadcastHandler } from './handlers/broadcast.handler';
import { PublishClientReadyHandler } from './handlers/publish-client-ready.handler';

export const SocketCommands = [SendHandler, BroadcastHandler, PublishClientReadyHandler];
