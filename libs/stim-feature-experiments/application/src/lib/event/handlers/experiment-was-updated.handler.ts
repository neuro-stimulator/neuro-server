import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentWasUpdatedEvent } from '../impl/experiment-was-updated.event';

@EventsHandler(ExperimentWasUpdatedEvent)
export class ExperimentWasUpdatedHandler implements IEventHandler<ExperimentWasUpdatedEvent> {
  private readonly logger: Logger = new Logger(ExperimentWasUpdatedHandler.name);

  handle(event: ExperimentWasUpdatedEvent): void {
    this.logger.debug('Experiment byl aktualizován.');
  }
}
