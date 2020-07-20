import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SocketService } from '../../../domain/services/socket.service';
import { SendCommand } from '../impl/send.command';

@CommandHandler(SendCommand)
export class SendHandler implements ICommandHandler<SendCommand> {
  constructor(private readonly service: SocketService) {}

  async execute(command: SendCommand): Promise<any> {
    this.service.sendCommand(command.clientID, command.message);
  }
}
