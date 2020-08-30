import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasUpdatedEvent } from '../impl/sequence-was-updated.event';

@EventsHandler(SequenceWasUpdatedEvent)
export class SequenceWasUpdatedHandler implements IEventHandler<SequenceWasUpdatedEvent> {
  private readonly logger: Logger = new Logger(SequenceWasUpdatedHandler.name);

  handle(event: SequenceWasUpdatedEvent): void {
    this.logger.debug('Sekvence byla aktualizována.');
  }
}
