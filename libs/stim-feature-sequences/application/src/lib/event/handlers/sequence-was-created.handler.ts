import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasCreatedEvent } from '../impl/sequence-was-created.event';

@EventsHandler(SequenceWasCreatedEvent)
export class SequenceWasCreatedHandler implements IEventHandler<SequenceWasCreatedEvent> {
  private readonly logger: Logger = new Logger(SequenceWasCreatedHandler.name);

  handle(event: SequenceWasCreatedEvent): void {
    this.logger.debug('Sekvence byla vytvořena.');
  }
}
