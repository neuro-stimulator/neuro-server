import { ICommand } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class SequenceNextPartCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'sequence-part';

  constructor(public readonly sequence: Sequence, public readonly offset: number, public readonly index: number, public readonly waitForResponse = false) {}
}
