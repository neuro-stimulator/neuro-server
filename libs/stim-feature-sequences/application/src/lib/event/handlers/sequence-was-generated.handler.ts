import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasGeneratedEvent } from '../impl/sequence-was-generated.event';

@EventsHandler(SequenceWasGeneratedEvent)
export class SequenceWasGeneratedHandler
  implements IEventHandler<SequenceWasGeneratedEvent> {
  handle(event: SequenceWasGeneratedEvent): any {}
}
