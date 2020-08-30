import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasDeletedEvent } from '../impl/experiment-was-deleted.event';

@EventsHandler(ExperimentWasDeletedEvent)
export class ExperimentWasDeletedHandler implements IEventHandler<ExperimentWasDeletedEvent> {
  private readonly logger: Logger = new Logger(ExperimentWasDeletedHandler.name);

  handle(event: ExperimentWasDeletedEvent): void {
    this.logger.debug('Experiment byl smazán.');
  }
}
