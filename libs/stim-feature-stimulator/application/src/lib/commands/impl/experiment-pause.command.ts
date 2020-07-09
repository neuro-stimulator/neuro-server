import { ICommand } from '@nestjs/cqrs';

export class ExperimentPauseCommand implements ICommand {
  constructor(
    public readonly experimentID: number,
    public readonly waitForResponse = false
  ) {}
}
