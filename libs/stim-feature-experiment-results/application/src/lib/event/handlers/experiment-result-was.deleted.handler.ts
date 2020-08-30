import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentResultWasDeletedEvent } from '../impl/experiment-result-was-deleted.event';

@EventsHandler(ExperimentResultWasDeletedEvent)
export class ExperimentResultWasDeletedHandler implements IEventHandler {
  private readonly logger: Logger = new Logger(ExperimentResultWasDeletedHandler.name);

  handle(event: any): void {
    this.logger.debug('Výsledek experimentu byl smazán.');
  }
}
