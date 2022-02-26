import { ICommand } from '@nestjs/cqrs';

import { ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

export class WriteExperimentResultToFileCommand implements ICommand {
  constructor(public readonly experimentResult: ExperimentResult, public readonly experimentResultData: IOEvent[][]) {}
}
