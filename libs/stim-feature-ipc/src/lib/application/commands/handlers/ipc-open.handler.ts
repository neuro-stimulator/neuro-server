import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcService } from '../../services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler implements ICommandHandler<IpcOpenCommand, void> {
  private readonly logger: Logger = new Logger(IpcOpenHandler.name);

  constructor(private readonly service: IpcService) {}

  async execute(command: IpcOpenCommand): Promise<void> {
    this.logger.debug('Budu otevírat komunikační IPC socket.');
    this.service.open();
  }
}
