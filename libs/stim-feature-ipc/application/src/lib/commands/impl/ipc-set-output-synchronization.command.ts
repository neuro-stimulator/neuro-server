import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcSetOutputSynchronizationCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'toggle-output-synchronization';

  constructor(public readonly synchronize: boolean, public readonly waitForResponse = false) {}
}
