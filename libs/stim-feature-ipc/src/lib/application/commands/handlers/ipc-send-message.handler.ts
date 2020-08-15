import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcService } from '../../services/ipc.service';
import { IpcSendMessageCommand } from '../impl/ipc-send-message.command';

@CommandHandler(IpcSendMessageCommand)
export class IpcSendMessageHandler implements ICommandHandler<IpcSendMessageCommand<any>, void> {
  private readonly logger: Logger = new Logger(IpcSendMessageHandler.name);

  constructor(private readonly service: IpcService) {}

  async execute(command: IpcSendMessageCommand<any>): Promise<void> {
    if (!this.service.isConnected) {
      this.logger.debug('Nebudu odesílat žádnou IPC zprávu, protože klient není připojený.');
      return;
    }

    this.logger.debug('Budu odesílat zprávu IPC klientovi');
    await this.service.send(command.message);
  }
}
