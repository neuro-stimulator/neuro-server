import { IEvent } from '@nestjs/cqrs';

import { Experiment } from '@stechy1/diplomka-share';

export class ExperimentWasDeletedEvent implements IEvent {
  constructor(public readonly experiment: Experiment) {}
}
