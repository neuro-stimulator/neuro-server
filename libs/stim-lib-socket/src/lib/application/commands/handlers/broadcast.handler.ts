import { ICommandHandler } from '@nestjs/cqrs';

import { SocketService } from '../../../domain/services/socket.service';
import { BroadcastCommand } from '../impl/broadcast.command';

export class BroadcastHandler implements ICommandHandler<BroadcastCommand> {
  constructor(private readonly service: SocketService) {}

  async execute(command: BroadcastCommand): Promise<any> {
    this.service.broadcastCommand(command.message);
  }
}
