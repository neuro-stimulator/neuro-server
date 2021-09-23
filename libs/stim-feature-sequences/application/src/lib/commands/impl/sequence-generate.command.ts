import { ICommand } from '@nestjs/cqrs';

export class SequenceGenerateCommand implements ICommand {
  constructor(public readonly userGroups: number[], public readonly experimentID: number, public readonly sequenceSize: number) {}
}
