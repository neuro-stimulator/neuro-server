import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasDeletedEvent } from '../impl/sequence-was-deleted.event';

@EventsHandler(SequenceWasDeletedEvent)
export class SequenceWasDeletedHandler implements IEventHandler<SequenceWasDeletedEvent> {
  private readonly logger: Logger = new Logger(SequenceWasDeletedHandler.name);

  handle(event: SequenceWasDeletedEvent): void {
    this.logger.debug('Sekvence byla smazána.');
  }
}
