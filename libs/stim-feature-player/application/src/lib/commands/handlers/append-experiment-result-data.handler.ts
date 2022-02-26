import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PlayerService } from '../../service/player.service';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';

@CommandHandler(AppendExperimentResultDataCommand)
export class AppendExperimentResultDataHandler implements ICommandHandler<AppendExperimentResultDataCommand, void> {
  private readonly logger: Logger = new Logger(AppendExperimentResultDataHandler.name);

  constructor(private readonly service: PlayerService) {}

  async execute(command: AppendExperimentResultDataCommand): Promise<void> {
    this.logger.debug('Ukládám dílčí IO událost do aktuálního výsledku experimentu.');
    this.service.pushResultData(command.data);
  }
}
