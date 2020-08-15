import { ICommand } from '@nestjs/cqrs';

import { IpcMessage } from '../../../domain/model/ipc-message';

export class IpcSendMessageCommand<T> implements ICommand {
  constructor(public readonly message: IpcMessage<T>) {}
}
