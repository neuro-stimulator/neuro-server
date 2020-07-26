import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PlayerService } from '../../service/player.service';
import { CanExperimentContinueCommand } from '../impl/can-experiment-continue.command';

@QueryHandler(CanExperimentContinueCommand)
export class CanExperimentContinueHandler implements IQueryHandler<CanExperimentContinueCommand, boolean> {
  private readonly logger: Logger = new Logger(CanExperimentContinueHandler.name);

  constructor(private readonly service: PlayerService) {}

  async execute(query: CanExperimentContinueCommand): Promise<boolean> {
    this.logger.debug('Budu kontrolovat ukončovací podmínky experimentu.');
    // TODO zkontrolovat ukončovací podmínky

    this.logger.debug('Experiment může pokračovat.');
    return true;
  }
}
