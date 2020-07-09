import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasCreatedEvent } from '../impl/sequence-was-created.event';

@EventsHandler(SequenceWasCreatedEvent)
export class SequenceWasCreatedHandler
  implements IEventHandler<SequenceWasCreatedEvent> {
  handle(event: SequenceWasCreatedEvent): any {}
}
