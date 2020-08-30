import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasGeneratedEvent } from '../impl/sequence-was-generated.event';

@EventsHandler(SequenceWasGeneratedEvent)
export class SequenceWasGeneratedHandler implements IEventHandler<SequenceWasGeneratedEvent> {
  private readonly logger: Logger = new Logger(SequenceWasGeneratedHandler.name);

  handle(event: SequenceWasGeneratedEvent): void {
    this.logger.debug('Sekvence byla vygenerována.');
  }
}
