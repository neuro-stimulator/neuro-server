import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentWasNotUpdatedError } from '../../../domain/exception/experiment-was-not-updated.error';
import { ExperimentWasUpdatedEvent } from '../../event';
import { ExperimentUpdateCommand } from '../impl/experiment-update.command';

@CommandHandler(ExperimentUpdateCommand)
export class ExperimentUpdateHandler
  implements ICommandHandler<ExperimentUpdateCommand> {
  constructor(
    private readonly service: ExperimentsService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ExperimentUpdateCommand): Promise<any> {
    try {
      const id = await this.service.update(command.experiment);
      this.eventBus.publish(new ExperimentWasUpdatedEvent(command.experiment));
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentWasNotUpdatedError(
          command.experiment,
          (e as unknown) as QueryError
        );
      }
      throw new ExperimentWasNotUpdatedError(command.experiment);
    }
  }
}
