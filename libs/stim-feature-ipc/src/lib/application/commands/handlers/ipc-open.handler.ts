import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcService } from '../../../domain/services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler implements ICommandHandler<IpcOpenCommand, void> {
  constructor(private readonly service: IpcService) {}

  async execute(command: IpcOpenCommand): Promise<void> {
    this.service.open('');
  }
}
