import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentFinishedEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { ExperimentResultInsertCommand, WriteExperimentResultToFileCommand } from '@diplomka-backend/stim-feature-experiment-results/application';

import { PlayerService } from '../../service/player.service';

@EventsHandler(ExperimentFinishedEvent)
export class ExperimentFinishedHandler implements IEventHandler<ExperimentFinishedEvent> {
  private readonly logger: Logger = new Logger(ExperimentFinishedHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly service: PlayerService) {}

  async handle(event: ExperimentFinishedEvent): Promise<void> {
    this.logger.debug('Experiment byl úspěšně ukončen.');

    try {
      this.logger.debug('Nechám zapsat výsledek experimentu do souboru.');
      await this.commandBus.execute(new WriteExperimentResultToFileCommand(this.service.activeExperimentResult, this.service.experimentResultData));
      this.logger.debug('Nechám vložit záznam výsledku experimentu do databáze.');
      await this.commandBus.execute(new ExperimentResultInsertCommand(this.service.activeExperimentResult));
      this.logger.debug('Vymažu aktuální výsledek experiementu z paměti.');
      this.service.clearRunningExperimentResult();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
