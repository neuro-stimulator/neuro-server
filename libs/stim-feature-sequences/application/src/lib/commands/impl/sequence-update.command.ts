import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

export class SequenceUpdateCommand implements ICommand {
  constructor(public readonly sequence: Sequence, public readonly userID: number) {}
}
