import { IEvent } from '@nestjs/cqrs';

export class SequenceWasGeneratedEvent implements IEvent {
  constructor(public readonly sequenceData: number[]) {}
}
