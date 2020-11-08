import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcSendStimulatorStateChangeCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'stimulator-state-change';

  constructor(public readonly state: number, public readonly waitForResponse = false) {}
}
