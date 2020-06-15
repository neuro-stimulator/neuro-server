import { ICommand } from '@nestjs/cqrs';

import { SocketMessage } from '../../../domain/model/socket.message';

export class BroadcastCommand implements ICommand {
  constructor(public readonly message: SocketMessage) {}
}
