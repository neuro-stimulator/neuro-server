import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentClearCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'clear';

  constructor(public readonly waitForResponse = false, public readonly force = false) {}
}
