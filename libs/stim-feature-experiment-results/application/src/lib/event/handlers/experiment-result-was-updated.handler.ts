import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentResultWasUpdatedEvent } from '../impl/experiment-result-was-updated.event';

@EventsHandler(ExperimentResultWasUpdatedEvent)
export class ExperimentResultWasUpdatedHandler implements IEventHandler<ExperimentResultWasUpdatedEvent> {
  private readonly logger: Logger = new Logger(ExperimentResultWasUpdatedHandler.name);

  handle(event: ExperimentResultWasUpdatedEvent): void {
    this.logger.debug('Výsledek experimentu byl aktualizován.');
  }
}
