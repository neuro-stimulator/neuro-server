import { ICommand } from '@nestjs/cqrs';

export class SequenceDeleteCommand implements ICommand {
  constructor(public readonly sequenceID: number) {}
}
