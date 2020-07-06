import { IEvent } from '@nestjs/cqrs';

export class ExperimentResultWasCreatedEvent implements IEvent {
  constructor(public readonly experimentResultID: number) {}
}
