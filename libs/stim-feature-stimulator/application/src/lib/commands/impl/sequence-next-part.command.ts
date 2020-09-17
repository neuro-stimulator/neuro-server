import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class SequenceNextPartCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'sequence-part';

  constructor(public readonly offset: number, public readonly index: number, public readonly waitForResponse = false) {}
}
