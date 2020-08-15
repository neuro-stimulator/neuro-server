import { IpcCloseHandler } from './handlers/ipc-close-handler';
import { IpcOpenHandler } from './handlers/ipc-open.handler';
import { IpcSendMessageHandler } from './handlers/ipc-send-message.handler';

export const CommandHandlers = [IpcCloseHandler, IpcOpenHandler, IpcSendMessageHandler];
