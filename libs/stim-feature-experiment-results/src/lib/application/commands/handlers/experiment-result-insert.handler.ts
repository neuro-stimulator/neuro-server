import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentResultIsNotInitializedException } from '../../../domain/exception/experiment-result-is-not-initialized.exception';
import { ExperimentResultWasNotCreatedError } from '../../../domain/exception/experiment-result-was-not-created.error';
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
      const id = await this.service.insert();
      // Zvěřejním událost, že byl vytvořen nový výsledek experimentu
      this.eventBus.publish(new ExperimentResultWasCreatedEvent(id));
      // Vrátím ID záznamu výsledku experimentu v databázi
      return id;
    } catch (e) {
      if (e instanceof ExperimentResultIsNotInitializedException) {
        throw new ExperimentResultIsNotInitializedException();
      } else if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotCreatedError(this.service.activeExperimentResult, (e as unknown) as QueryError);
      }
      throw new ExperimentResultWasNotCreatedError(this.service.activeExperimentResult);
    }
  }
}
