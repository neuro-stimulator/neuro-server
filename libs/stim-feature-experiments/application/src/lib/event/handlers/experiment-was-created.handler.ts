import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasCreatedEvent } from '../impl/experiment-was-created.event';

@EventsHandler(ExperimentWasCreatedEvent)
export class ExperimentWasCreatedHandler implements IEventHandler<ExperimentWasCreatedEvent> {
  private readonly logger: Logger = new Logger(ExperimentWasCreatedHandler.name);

  handle(event: ExperimentWasCreatedEvent): void {
    this.logger.debug('Experiment byl vytvořen.');
  }
}
