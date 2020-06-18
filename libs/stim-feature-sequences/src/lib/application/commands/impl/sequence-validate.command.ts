import { ICommand } from '@nestjs/cqrs';
import { Sequence } from '@stechy1/diplomka-share';

export class SequenceValidateCommand implements ICommand {
  constructor(public readonly sequence: Sequence) {}
}
