import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentNotValidException } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentWasNotUpdatedError } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentIdNotFoundError } from '@diplomka-backend/stim-feature-experiments/domain';
import { QueryError } from '@diplomka-backend/stim-feature-experiments/domain';

import { ExperimentsService } from '../../services/experiments.service';
import { ExperimentWasUpdatedEvent } from '../../event/impl/experiment-was-updated.event';
import { ExperimentUpdateCommand } from '../impl/experiment-update.command';
import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

@CommandHandler(ExperimentUpdateCommand)
export class ExperimentUpdateHandler implements ICommandHandler<ExperimentUpdateCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentUpdateHandler.name);

  constructor(private readonly service: ExperimentsService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat experiment v databázi.');
    this.logger.debug('1. Zvaliduji aktualizovaný experiment.');
    await this.commandBus.execute(new ExperimentValidateCommand(command.experiment));
    try {
      this.logger.debug('2. Budu aktualizovat validní experiment.');
      await this.service.update(command.experiment);
      this.eventBus.publish(new ExperimentWasUpdatedEvent(command.experiment));
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        throw new ExperimentNotValidException(e.experiment);
      } else if (e instanceof ExperimentIdNotFoundError) {
        throw new ExperimentIdNotFoundError(e.experimentID);
      } else if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotUpdatedError(command.experiment, (e as unknown) as QueryError);
      }
      throw new ExperimentWasNotUpdatedError(command.experiment);
    }
  }
}
