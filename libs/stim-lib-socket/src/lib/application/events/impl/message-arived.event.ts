import { IEvent } from '@nestjs/cqrs';

import { SocketMessage } from '@stechy1/diplomka-share';

export class MessageArivedEvent implements IEvent {
  constructor(public readonly clientID: string, public readonly message: SocketMessage) {}
}
