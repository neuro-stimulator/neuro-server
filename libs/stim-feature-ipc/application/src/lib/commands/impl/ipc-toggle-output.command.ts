import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcToggleOutputCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'toggle-output';

  constructor(public readonly index: number, public readonly waitForResponse = false) {}
}
