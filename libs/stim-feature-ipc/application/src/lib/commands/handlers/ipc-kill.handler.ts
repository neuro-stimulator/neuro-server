import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcKillCommand } from '../impl/ipc-kill.command';
import { IpcService } from '../../services/ipc.service';

@CommandHandler(IpcKillCommand)
export class IpcKillHandler implements ICommandHandler<IpcKillCommand> {
  private readonly logger: Logger = new Logger(IpcKillHandler.name);

  constructor(private readonly service: IpcService) {}

  async execute(command: IpcKillCommand): Promise<any> {
    this.logger.debug('Budu vypínat přehrávač multimédií.');
    return this.service.kill();
  }
}
