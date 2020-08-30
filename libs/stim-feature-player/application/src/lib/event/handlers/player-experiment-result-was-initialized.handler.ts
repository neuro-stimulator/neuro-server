import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentResultWasInitializedEvent } from '../impl/experiment-result-was-initialized.event';

@EventsHandler(ExperimentResultWasInitializedEvent)
export class PlayerExperimentResultWasInitializedHandler implements IEventHandler<ExperimentResultWasInitializedEvent> {
  private readonly logger: Logger = new Logger(PlayerExperimentResultWasInitializedHandler.name);

  async handle(event: ExperimentResultWasInitializedEvent): Promise<any> {
    this.logger.debug('Výsledek experimentu byl úspěšně inicializován.');
  }
}
