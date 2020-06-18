import { IEventHandler } from '@nestjs/cqrs';

import { SequenceWasGeneratedEvent } from '../impl/sequence-was-generated.event';

export class SequenceWasGeneratedHandler
  implements IEventHandler<SequenceWasGeneratedEvent> {
  handle(event: SequenceWasGeneratedEvent): any {}
}
