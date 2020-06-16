import { ICommand } from '@nestjs/cqrs';

export class ExperimentFinishCommand implements ICommand {
  constructor(public readonly experimentID: number) {}
}
