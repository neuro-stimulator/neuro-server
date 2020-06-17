import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentResultWasNotCreatedError } from '../../../domain/exception';
import { ExperimentResultWasCreatedEvent } from '../../event';
import { ExperimentResultInsertCommand } from '../impl/experiment-result-insert.command';

@CommandHandler(ExperimentResultInsertCommand)
export class ExperimentResultInsertHandler
  implements ICommandHandler<ExperimentResultInsertCommand, number> {
  constructor(
    private readonly service: ExperimentResultsService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ExperimentResultInsertCommand): Promise<number> {
    try {
      // Nechám vložit aktuální výsledek experimentu do databáze
      const id = await this.service.insert();
      // Zvěřejním událost, že byl vytvořen nový výsledek experimentu
      this.eventBus.publish(new ExperimentResultWasCreatedEvent(id));
      // Vymažu aktuální instanci výsledku experimentu z pomocné paměti
      this.service.clearRunningExperimentResult();
      // Vrátím ID záznamu výsledku experimentu v databázi
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotCreatedError(
          this.service.activeExperimentResult,
          (e as unknown) as QueryError
        );
      }
      throw new ExperimentResultWasNotCreatedError(
        this.service.activeExperimentResult
      );
    }
  }
}
