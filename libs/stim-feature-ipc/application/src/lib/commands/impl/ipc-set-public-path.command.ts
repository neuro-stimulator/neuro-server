import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcSetPublicPathCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'server-public-path';

  constructor(public readonly publicPath: string, public readonly waitForResponse = false) {}
}
