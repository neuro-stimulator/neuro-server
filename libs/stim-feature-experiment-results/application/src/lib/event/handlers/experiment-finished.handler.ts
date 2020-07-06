import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentFinishedEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { WriteExperimentResultToFileCommand } from '../../commands/impl/write-experiment-result-to-file.command';
import { ExperimentResultInsertCommand } from '../../commands/impl/experiment-result-insert.command';

@EventsHandler(ExperimentFinishedEvent)
export class ExperimentFinishedHandler implements IEventHandler<ExperimentFinishedEvent> {
  private readonly logger: Logger = new Logger(ExperimentFinishedHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly service: ExperimentResultsService) {}

  async handle(event: ExperimentFinishedEvent): Promise<void> {
    this.logger.debug('Experiment byl úspěšně ukončen.');

    try {
      this.logger.debug('Nechám zapsat výsledek experimentu do souboru.');
      await this.commandBus.execute(new WriteExperimentResultToFileCommand());
      this.logger.debug('Nechám vložit záznam výsledku experimentu do databáze.');
      await this.commandBus.execute(new ExperimentResultInsertCommand());
      this.logger.debug('Vymažu aktuální výsledek experiementu z paměti.');
      this.service.clearRunningExperimentResult();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
