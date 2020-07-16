import { ICommand } from '@nestjs/cqrs';

import { Experiment } from '@stechy1/diplomka-share';

import { EXPERIMENT_FULL_GROUP } from "@diplomka-backend/stim-feature-experiments/domain";

export class ExperimentValidateCommand implements ICommand {
  constructor(public readonly experiment: Experiment, public readonly validationGroups: string[] = [EXPERIMENT_FULL_GROUP]) {}
}
