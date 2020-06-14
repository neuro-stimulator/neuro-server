import { EventBus, EventsHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentWasNotDeletedError } from '../../../domain/exception/experiment-was-not-deleted.error';
import { ExperimentWasDeletedEvent } from '../../event';
import { ExperimentDeleteCommand } from '../impl/experiment-delete.command';

@EventsHandler(ExperimentDeleteCommand)
export class ExperimentDeleteHandler
  implements ICommandHandler<ExperimentDeleteCommand, void> {
  constructor(
    private readonly service: ExperimentsService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ExperimentDeleteCommand): Promise<void> {
    try {
      const experiment: Experiment = await this.service.byId(
        command.experimentID
      );
      await this.service.delete(command.experimentID);
      this.eventBus.publish(new ExperimentWasDeletedEvent(experiment));
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotDeletedError(
          command.experimentID,
          (e as unknown) as QueryError
        );
      }
      throw new ExperimentWasNotDeletedError(command.experimentID);
    }
  }
}
