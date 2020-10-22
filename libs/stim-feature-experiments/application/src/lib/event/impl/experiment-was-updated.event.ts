import { IEvent } from '@nestjs/cqrs';

import { Experiment, Output } from '@stechy1/diplomka-share';

export class ExperimentWasUpdatedEvent implements IEvent {
  constructor(public readonly experiment: Experiment<Output>) {}
}
