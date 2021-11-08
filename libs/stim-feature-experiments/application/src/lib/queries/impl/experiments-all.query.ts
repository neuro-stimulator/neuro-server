import { IQuery } from '@nestjs/cqrs';

import { ExperimentOptionalFindOptions } from '@neuro-server/stim-feature-experiments/domain';


export class ExperimentsAllQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly optionalOptions?: ExperimentOptionalFindOptions) {}
}
