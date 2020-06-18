import { ICommand } from '@nestjs/cqrs';

import { ExperimentResult } from '@stechy1/diplomka-share';

export class ExperimentResultValidateCommand implements ICommand {
  constructor(public readonly experimentResult: ExperimentResult) {}
}
