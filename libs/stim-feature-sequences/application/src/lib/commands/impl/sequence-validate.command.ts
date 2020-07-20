import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { EXPERIMENT_FULL_GROUP } from '@diplomka-backend/stim-feature-experiments/domain';

export class SequenceValidateCommand implements ICommand {
  constructor(public readonly sequence: Sequence, public readonly validationGroups: string[] = [EXPERIMENT_FULL_GROUP]) {}
}
