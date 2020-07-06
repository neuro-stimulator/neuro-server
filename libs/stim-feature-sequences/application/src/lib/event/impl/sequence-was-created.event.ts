import { IEvent } from '@nestjs/cqrs';

export class SequenceWasCreatedEvent implements IEvent {
  constructor(public readonly sequenceID: number) {}
}
