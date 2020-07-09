import { ICommand } from '@nestjs/cqrs';

export class ExperimentClearCommand implements ICommand {
  constructor(public readonly waitForResponse = false) {}
}
