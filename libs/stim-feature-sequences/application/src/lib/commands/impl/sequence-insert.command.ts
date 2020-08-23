import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

export class SequenceInsertCommand implements ICommand {
  constructor(public readonly sequence: Sequence, public readonly userID: number) {}
}
