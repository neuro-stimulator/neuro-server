import { IEvent } from '@nestjs/cqrs';

export class ExperimentResultWasInitializedEvent implements IEvent {
  constructor(public readonly timestamp: number) {}
}
