import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentPauseCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'pause';

  constructor(public readonly experimentID: number, public readonly waitForResponse = false) {}
}
