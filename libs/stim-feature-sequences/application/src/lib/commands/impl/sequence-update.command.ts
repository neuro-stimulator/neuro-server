import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

export class SequenceUpdateCommand implements ICommand {
  constructor(public readonly userGroups: number[], public readonly sequence: Sequence) {}
}
