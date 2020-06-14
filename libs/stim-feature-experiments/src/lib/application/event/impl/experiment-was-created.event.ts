import { IEvent } from '@nestjs/cqrs';

export class ExperimentWasCreatedEvent implements IEvent {
  constructor(public readonly experimentID: number) {}
}
