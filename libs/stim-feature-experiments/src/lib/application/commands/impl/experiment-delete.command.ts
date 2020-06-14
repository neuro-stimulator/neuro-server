import { ICommand } from '@nestjs/cqrs';

export class ExperimentDeleteCommand implements ICommand {
  constructor(public readonly experimentID: number) {}
}
