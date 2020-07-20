import { IEvent } from '@nestjs/cqrs';

export class ExperimentInitializedEvent implements IEvent {
  constructor(public readonly timestamp: number) {}
}
