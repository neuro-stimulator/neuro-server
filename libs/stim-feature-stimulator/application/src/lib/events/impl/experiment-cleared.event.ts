import { IEvent } from '@nestjs/cqrs';

export class ExperimentClearedEvent implements IEvent {
  constructor(public readonly force: boolean) {}
}
