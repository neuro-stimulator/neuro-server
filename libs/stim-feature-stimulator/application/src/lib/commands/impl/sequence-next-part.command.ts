import { ICommand } from '@nestjs/cqrs';

export class SequenceNextPartCommand implements ICommand {
  constructor(
    public readonly offset: number,
    public readonly index: number,
    public readonly waitForResponse = false
  ) {}
}
