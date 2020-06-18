import { ICommand } from '@nestjs/cqrs';

import { Experiment } from '@stechy1/diplomka-share';

export class ExperimentValidateCommand implements ICommand {
  constructor(public readonly experiment: Experiment) {}
}
