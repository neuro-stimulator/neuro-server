import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { ExperimentResultWasNotUpdatedError } from '../../../domain/exception/experiment-result-was-not-updated.error';
import { ExperimentResultIdNotFoundError } from "../../../domain/exception/experiment-result-id-not-found.error";
import { QueryError } from '../../../domain/model/query-error';
import { ExperimentResultWasUpdatedEvent } from '../../event/impl/experiment-result-was-updated.event';
import { ExperimentResultUpdateCommand } from '../impl/experiment-result-update.command';

@CommandHandler(ExperimentResultUpdateCommand)
export class ExperimentResultUpdateHandler implements ICommandHandler<ExperimentResultUpdateCommand, void> {
  constructor(private readonly service: ExperimentResultsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultUpdateCommand): Promise<void> {
    try {
      // Aktualizuji výsledek experimentu
      await this.service.update(command.experimentResult);
      // Zvěřejním událost, že výsledek experimentu byl aktualizován
      this.eventBus.publish(new ExperimentResultWasUpdatedEvent(command.experimentResult));
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundError) {
        throw new ExperimentResultIdNotFoundError(e.experimentResultID);
      } else if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotUpdatedError(command.experimentResult, (e as unknown) as QueryError);
      }
      throw new ExperimentResultWasNotUpdatedError(command.experimentResult);
    }
  }
}
