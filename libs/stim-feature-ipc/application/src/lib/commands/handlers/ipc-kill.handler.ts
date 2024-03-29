import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { AssetPlayerNotRunningException, ExitMessage } from '@neuro-server/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcKillCommand } from '../impl/ipc-kill.command';

@CommandHandler(IpcKillCommand)
export class IpcKillHandler implements ICommandHandler<IpcKillCommand> {
  private readonly logger: Logger = new Logger(IpcKillHandler.name);

  constructor(private readonly service: IpcService) {}

  async execute(command: IpcKillCommand): Promise<void> {
    this.logger.debug('Budu vypínat přehrávač multimédií.');
      if (this.service.status !== ConnectionStatus.CONNECTED) {
        throw new AssetPlayerNotRunningException();
      }

      this.logger.verbose('Odesílám zprávu pro ukončení přehrávače multimédií.');
      this.service.send(new ExitMessage());
  }
}
