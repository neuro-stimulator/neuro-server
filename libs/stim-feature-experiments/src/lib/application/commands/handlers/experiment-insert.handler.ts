import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentWasNotCreatedError } from '../../../domain/exception/experiment-was-not-created.error';
import { ExperimentWasCreatedEvent } from '../../event/impl/experiment-was-created.event';
import { ExperimentInsertCommand } from '../impl/experiment-insert.command';
import { Logger } from '@nestjs/common';

@CommandHandler(ExperimentInsertCommand)
export class ExperimentInsertHandler implements ICommandHandler<ExperimentInsertCommand, number> {
  private readonly logger: Logger = new Logger(ExperimentInsertHandler.name);

  constructor(private readonly service: ExperimentsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat nový experiment do databáze.');
    try {
      const id = await this.service.insert(command.experiment);
      this.eventBus.publish(new ExperimentWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotCreatedError(command.experiment, (e as unknown) as QueryError);
      }
      throw new ExperimentWasNotCreatedError(command.experiment);
    }
  }
}
