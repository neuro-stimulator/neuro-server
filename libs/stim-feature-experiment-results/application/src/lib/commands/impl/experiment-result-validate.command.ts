import { ICommand } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { EXPERIMENT_FULL_GROUP } from '@neuro-server/stim-feature-experiments/domain';

export class ExperimentResultValidateCommand implements ICommand {
  constructor(public readonly experimentResult: ExperimentResult, public readonly validationGroups: string[] = [EXPERIMENT_FULL_GROUP]) {}
}
