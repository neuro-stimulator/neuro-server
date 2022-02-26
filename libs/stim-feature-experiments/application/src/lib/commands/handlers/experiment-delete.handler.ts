import { QueryFailedError } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Experiment, Output } from '@stechy1/diplomka-share';

import { ExperimentWasNotDeletedException, ExperimentIdNotFoundException } from '@neuro-server/stim-feature-experiments/domain';
import { QueryError } from '@neuro-server/stim-lib-common';

import { ExperimentWasDeletedEvent } from '../../event/impl/experiment-was-deleted.event';
import { ExperimentsService } from '../../services/experiments.service';
import { ExperimentDeleteCommand } from '../impl/experiment-delete.command';

@CommandHandler(ExperimentDeleteCommand)
export class ExperimentDeleteHandler implements ICommandHandler<ExperimentDeleteCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentDeleteHandler.name);

  constructor(private readonly service: ExperimentsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentDeleteCommand): Promise<void> {
    this.logger.debug('Budu mazat experiment z databáze.');
    try {
      const experiment: Experiment<Output> = await this.service.byId(command.userGroups, command.experimentID);
      await this.service.delete(command.experimentID, experiment.type);
      this.eventBus.publish(new ExperimentWasDeletedEvent(experiment));
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        throw new ExperimentIdNotFoundException(e.experimentID);
      } else if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotDeletedException(command.experimentID, (e as unknown) as QueryError);
      }
      throw new ExperimentWasNotDeletedException(command.experimentID);
    }
  }
}
