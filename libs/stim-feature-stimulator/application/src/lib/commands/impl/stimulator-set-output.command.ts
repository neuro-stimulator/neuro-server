import { ICommand } from '@nestjs/cqrs';
import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class StimulatorSetOutputCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'set-output';

  constructor(public readonly index: number, public readonly enabled: boolean, public readonly waitForResponse = false) {}
}
