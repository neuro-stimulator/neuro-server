import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcCloseCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'ipc-close';

  constructor(public readonly waitForResponse = false) {}
}
