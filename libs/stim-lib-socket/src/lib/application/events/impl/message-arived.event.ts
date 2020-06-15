import { IEvent } from '@nestjs/cqrs';

import { SocketMessage } from '../../../domain/model/socket.message';

export class MessageArivedEvent implements IEvent {
  constructor(
    public readonly clientID: string,
    public readonly message: SocketMessage
  ) {}
}
