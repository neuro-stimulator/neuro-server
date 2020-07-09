import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcService } from '../../../domain/services/ipc.service';
import { IpcCloseCommand } from '../impl/ipc-close.command';

@CommandHandler(IpcCloseCommand)
export class IpcCloseHandler implements ICommandHandler<IpcCloseCommand, void> {
  constructor(private readonly service: IpcService) {}
  async execute(command: IpcCloseCommand): Promise<void> {
    this.service.close();
  }
}
