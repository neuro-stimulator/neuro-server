import { IQuery } from '@nestjs/cqrs';

import { ExperimentOptionalFindOptions } from '@diplomka-backend/stim-feature-experiments/domain';


export class ExperimentsAllQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly optionalOptions?: ExperimentOptionalFindOptions) {}
}
