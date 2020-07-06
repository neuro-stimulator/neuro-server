import { IEvent } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

export class SequenceWasDeletedEvent implements IEvent {
  constructor(public readonly sequence: Sequence) {}
}
