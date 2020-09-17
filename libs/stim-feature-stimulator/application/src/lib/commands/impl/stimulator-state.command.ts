import { ICommand } from '@nestjs/cqrs';

import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class StimulatorStateCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'state';

  constructor(public readonly waitForResponse = false) {}
}
