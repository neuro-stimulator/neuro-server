import { IEvent } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

export class ExperimentResultWasDeletedEvent implements IEvent {
  constructor(public readonly experimentResult: ExperimentResult) {}
}
