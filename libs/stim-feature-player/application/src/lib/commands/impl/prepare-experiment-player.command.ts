import { ICommand } from '@nestjs/cqrs';
import { ExperimentType } from '@stechy1/diplomka-share';

export class PrepareExperimentPlayerCommand implements ICommand {
  constructor(public readonly experimentID: number, public readonly options) {}
}
