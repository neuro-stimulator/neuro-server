import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PlayerService } from '../../service/player.service';
import { ExperimentResultClearCommand } from '../impl/experiment-result-clear.command';
import { SendPlayerStateToClientCommand } from '../impl/to-client/send-player-state-to-client.command';

@CommandHandler(ExperimentResultClearCommand)
export class ExperimentResultClearHandler implements ICommandHandler<ExperimentResultClearCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentResultClearHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async execute(command: ExperimentResultClearCommand): Promise<void> {
    this.logger.debug('Budu mazat aktuální výsledek experimentu.');

    this.service.clearRunningExperimentResult();
    await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration));
  }
}
