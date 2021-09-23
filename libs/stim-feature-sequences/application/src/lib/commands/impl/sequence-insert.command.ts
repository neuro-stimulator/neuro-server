import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

export class SequenceInsertCommand implements ICommand {
  constructor(public readonly userID: number, public readonly sequence: Sequence) {}
}
