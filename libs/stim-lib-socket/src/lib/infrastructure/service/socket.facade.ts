import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SocketMessage } from '../../domain/model/socket.message';
import { BroadcastCommand, SendCommand } from '../../application/commands';

@Injectable()
export class SocketFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async sendCommand(clidntID: string, message: SocketMessage) {
    await this.commandBus.execute(new SendCommand(clidntID, message));
  }

  public async broadcastCommand(message: SocketMessage) {
    await this.commandBus.execute(new BroadcastCommand(message));
  }
}
