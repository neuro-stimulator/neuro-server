import { IQuery } from '@nestjs/cqrs';

import { ExperimentType } from '@stechy1/diplomka-share';

export class StopConditionTypesQuery implements IQuery {
  constructor(public readonly experimentType: ExperimentType) {}
}
