import { IEvent } from '@nestjs/cqrs';

export class ExperimentFinishedEvent implements IEvent {
  constructor(public readonly force: boolean) {}
}
