import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SocketMessage } from '@stechy1/diplomka-share';

import { BroadcastCommand } from '../../application/commands/impl/broadcast.command';
import { SendCommand } from '../../application/commands/impl/send.command';

@Injectable()
export class SocketFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async sendCommand(clidntID: string, message: SocketMessage): Promise<void> {
    await this.commandBus.execute(new SendCommand(clidntID, message));
  }

  public async broadcastCommand(message: SocketMessage): Promise<void> {
    await this.commandBus.execute(new BroadcastCommand(message));
  }
}
