import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcService } from '../../services/ipc.service';
import { IpcCloseCommand } from '../impl/ipc-close.command';
import { Logger } from "@nestjs/common";

@CommandHandler(IpcCloseCommand)
export class IpcCloseHandler implements ICommandHandler<IpcCloseCommand, void> {
  private readonly logger: Logger = new Logger(IpcCloseHandler.name);

  constructor(private readonly service: IpcService) {}

  async execute(command: IpcCloseCommand): Promise<void> {
    this.logger.debug("Budu zavírat komunikační IPC socket.");
    this.service.close();
  }
}
