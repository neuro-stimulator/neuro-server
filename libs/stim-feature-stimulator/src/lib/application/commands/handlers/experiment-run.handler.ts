import { ICommand } from '@nestjs/cqrs';

export class ExperimentRunCommand implements ICommand {
  constructor(public readonly experimentID: number) {}
}
