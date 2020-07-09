import { IEvent } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

export class ExperimentResultWasInitializedEvent implements IEvent {
  constructor(public readonly timestamp: number, public readonly experimentResult: ExperimentResult) {}
}
