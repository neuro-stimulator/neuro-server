import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasUpdatedEvent } from '../impl/sequence-was-updated.event';

@EventsHandler(SequenceWasUpdatedEvent)
export class SequenceWasUpdatedHandler
  implements IEventHandler<SequenceWasUpdatedEvent> {
  handle(event: SequenceWasUpdatedEvent): any {}
}
