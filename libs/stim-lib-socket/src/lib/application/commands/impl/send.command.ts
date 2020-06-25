import { ICommand } from '@nestjs/cqrs';

import { SocketMessage } from '@stechy1/diplomka-share';

export class SendCommand implements ICommand {
  constructor(
    public readonly clientID: string,
    public readonly message: SocketMessage
  ) {}
}
