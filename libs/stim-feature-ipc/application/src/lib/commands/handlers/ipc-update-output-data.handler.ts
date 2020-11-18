import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateOutputDataMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcUpdateOutputDataCommand } from '../impl/ipc-update-output-data.command';

@CommandHandler(IpcUpdateOutputDataCommand)
export class IpcUpdateOutputDataHandler implements ICommandHandler<IpcUpdateOutputDataCommand> {
  constructor(private readonly service: IpcService) {}

  async execute(command: IpcUpdateOutputDataCommand): Promise<void> {
    this.service.send<{ id: string; x: number; y: number }>(new UpdateOutputDataMessage(`${command.id}`, command.x, command.y));
  }
}
