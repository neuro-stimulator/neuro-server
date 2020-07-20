import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { QueryError } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { ExperimentResultWasNotDeletedError } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultWasDeletedEvent } from '../../event/impl/experiment-result-was-deleted.event';
import { ExperimentResultDeleteCommand } from '../impl/experiment-result-delete.command';

@CommandHandler(ExperimentResultDeleteCommand)
export class ExperimentResultDeleteHandler implements ICommandHandler<ExperimentResultDeleteCommand, void> {
  constructor(private readonly service: ExperimentResultsService, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultDeleteCommand): Promise<void> {
    try {
      // Získám výsledek experimentu podle ID
      const experimentResult: ExperimentResult = await this.service.byId(command.experimentResultID);
      // Nechám smazat výsledek experimentu
      await this.service.delete(command.experimentResultID);
      // Zvěřejním událost, že výsledek experimentu byl smazán
      this.eventBus.publish(new ExperimentResultWasDeletedEvent(experimentResult));
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ExperimentResultWasNotDeletedError(command.experimentResultID, (e as unknown) as QueryError);
      }
      throw new ExperimentResultWasNotDeletedError(command.experimentResultID);
    }
  }
}
