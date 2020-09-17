import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentRunCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'run';

  constructor(public readonly experimentID: number, public readonly waitForResponse = false) {}
}
