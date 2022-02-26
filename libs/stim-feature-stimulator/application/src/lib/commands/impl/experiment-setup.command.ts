import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentSetupCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'setup';

  constructor(public readonly experimentID: number, public readonly waitForResponse = false) {}
}
