import { ICommand } from '@nestjs/cqrs';

export class StartNewExperimentRoundCommand implements ICommand {
  constructor(public readonly timestamp: number) {}
}
