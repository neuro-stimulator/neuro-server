import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentWasNotUpdatedError } from '../../../domain/exception/experiment-was-not-updated.error';
import { ExperimentIdNotFoundError } from '../../../domain/exception/experiment-id-not-found.error';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentWasUpdatedEvent } from '../../event/impl/experiment-was-updated.event';
import { ExperimentUpdateCommand } from '../impl/experiment-update.command';
import { Logger } from '@nestjs/common';

@CommandHandler(ExperimentUpdateCommand)
export class ExperimentUpdateHandler implements ICommandHandler<ExperimentUpdateCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentUpdateHandler.name);

  constructor(private readonly service: ExperimentsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat experiment v databázi.');
    try {
      await this.service.update(command.experiment);
      this.eventBus.publish(new ExperimentWasUpdatedEvent(command.experiment));
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        throw new ExperimentIdNotFoundError(e.experimentID);
      }
      if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotUpdatedError(command.experiment, (e as unknown) as QueryError);
      }
      throw new ExperimentWasNotUpdatedError(command.experiment);
    }
  }
}
