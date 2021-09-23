import { ICommand } from '@nestjs/cqrs';

import { IpcBlockingCommand } from './base/ipc-blocking.command';

export class IpcSetOutputSynchronizationCommand implements ICommand, IpcBlockingCommand {
  public readonly commandType = 'toggle-output-synchronization';

  constructor(public readonly synchronize: boolean,
              public readonly userGroups?: number[],
              public readonly experimentID?: number,
              public readonly waitForResponse = false) {
  }
}
