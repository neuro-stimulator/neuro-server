import { QueryFailedError } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentResultNotValidException, ExperimentResultWasNotUpdatedException, ExperimentResultIdNotFoundException } from '@neuro-server/stim-feature-experiment-results/domain';
import { QueryError } from '@neuro-server/stim-lib-common';

import { ExperimentResultWasUpdatedEvent } from '../../event/impl/experiment-result-was-updated.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultUpdateCommand } from '../impl/experiment-result-update.command';
import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';

@CommandHandler(ExperimentResultUpdateCommand)
export class ExperimentResultUpdateHandler implements ICommandHandler<ExperimentResultUpdateCommand, boolean> {
  private readonly logger: Logger = new Logger(ExperimentResultUpdateHandler.name);

  constructor(private readonly service: ExperimentResultsService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultUpdateCommand): Promise<boolean> {
    this.logger.debug('Budu aktualizovat výsledek experimentu v databázi.');
    this.logger.debug('1. Zvaliduji výsledek experimentu.');
    try {
      await this.commandBus.execute(new ExperimentResultValidateCommand(command.experimentResult));
      this.logger.debug('2. Budu aktualizovat validní výsledek experimentu');
      // Aktualizuji výsledek experimentu
      const updated = await this.service.update(command.userGroups, command.experimentResult);
      if (updated) {
        // Zvěřejním událost, že výsledek experimentu byl aktualizován
        this.eventBus.publish(new ExperimentResultWasUpdatedEvent(command.experimentResult));
      }
      return updated;
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        throw e;
      } else if (e instanceof ExperimentResultIdNotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotUpdatedException(command.experimentResult, (e as unknown) as QueryError);
      }
      throw new ExperimentResultWasNotUpdatedException(command.experimentResult);
    }
  }
}
