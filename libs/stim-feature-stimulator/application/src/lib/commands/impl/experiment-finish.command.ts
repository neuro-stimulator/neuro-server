import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentFinishCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'finish';

  constructor(public readonly experimentID: number, public readonly waitForResponse = false, public readonly force = false) {}
}
