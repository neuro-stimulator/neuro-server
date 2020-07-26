import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { QueryError, ExperimentResultWasNotCreatedError } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultWasCreatedEvent } from '../../event/impl/experiment-result-was-created.event';
import { ExperimentResultInsertCommand } from '../impl/experiment-result-insert.command';

@CommandHandler(ExperimentResultInsertCommand)
export class ExperimentResultInsertHandler implements ICommandHandler<ExperimentResultInsertCommand, number> {
  private readonly logger: Logger = new Logger(ExperimentResultInsertHandler.name);

  constructor(private readonly service: ExperimentResultsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat výsledek experimentu do databáze.');
    try {
      // Nechám vložit aktuální výsledek experimentu do databáze
      const id = await this.service.insert(command.experimentResult);
      // Zvěřejním událost, že byl vytvořen nový výsledek experimentu
      this.eventBus.publish(new ExperimentResultWasCreatedEvent(id));
      // Vrátím ID záznamu výsledku experimentu v databázi
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotCreatedError(command.experimentResult, (e as unknown) as QueryError);
      }
      throw new ExperimentResultWasNotCreatedError(command.experimentResult);
    }
  }
}
