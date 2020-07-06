import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SequenceWasDeletedEvent } from '../impl/sequence-was-deleted.event';

@EventsHandler(SequenceWasDeletedEvent)
export class SequenceWasDeletedHandler
  implements IEventHandler<SequenceWasDeletedEvent> {
  handle(event: SequenceWasDeletedEvent): any {}
}
