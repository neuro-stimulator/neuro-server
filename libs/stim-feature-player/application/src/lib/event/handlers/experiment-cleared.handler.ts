import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentClearedEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';
import { PlayerService } from '../../service/player.service';

@EventsHandler(ExperimentClearedEvent)
export class ExperimentClearedHandler implements IEventHandler<ExperimentClearedEvent> {
  private readonly logger: Logger = new Logger(ExperimentClearedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentClearedEvent): Promise<void> {
    this.logger.debug('Experiment byl vymazán z paměti stimulátoru.');

    if (!this.service.nextRoundAvailable) {
      this.logger.debug('Protože už není dostupné žádné kolo experimentu, budu mazat výsledek expeirmentu.');
      await this.commandBus.execute(new ExperimentResultClearCommand());
    }
  }
}
