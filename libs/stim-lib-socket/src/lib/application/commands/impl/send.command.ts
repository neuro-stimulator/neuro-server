import { ICommand } from '@nestjs/cqrs';

import { SocketMessage } from '../../../domain/model/socket.message';

export class SendCommand implements ICommand {
  constructor(
    public readonly clientID: string,
    public readonly message: SocketMessage
  ) {}
}
