import { ICommand } from '@nestjs/cqrs';

import { SocketMessage } from '@stechy1/diplomka-share';

export class BroadcastCommand implements ICommand {
  constructor(public readonly message: SocketMessage) {}
}
