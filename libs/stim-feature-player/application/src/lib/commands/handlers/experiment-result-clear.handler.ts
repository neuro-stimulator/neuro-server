import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PlayerService } from '../../service/player.service';
import { ExperimentResultClearCommand } from '../impl/experiment-result-clear.command';

@CommandHandler(ExperimentResultClearCommand)
export class ExperimentResultClearHandler implements ICommandHandler<ExperimentResultClearCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentResultClearHandler.name);

  constructor(private readonly service: PlayerService) {}

  async execute(command: ExperimentResultClearCommand): Promise<void> {
    this.logger.debug('Budu mazat aktuální výsledek experimentu.');

    await this.service.clearRunningExperimentResult();
  }
}
