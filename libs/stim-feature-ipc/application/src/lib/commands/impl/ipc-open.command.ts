import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcOpenCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'ipc-open';

  constructor(public readonly waitForResponse = false) {}
}
