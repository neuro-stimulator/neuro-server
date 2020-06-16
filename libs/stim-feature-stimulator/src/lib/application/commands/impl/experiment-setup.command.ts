import { ICommand } from '@nestjs/cqrs';

export class ExperimentSetupCommand implements ICommand {
  constructor(public readonly experimentID: number) {}
}
