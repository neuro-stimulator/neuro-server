import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SocketMessage } from '@stechy1/diplomka-share';

import { SendCommand } from '../../application/commands/impl/send.command';
import { BroadcastCommand } from '../../application/commands/impl/broadcast.command';

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
