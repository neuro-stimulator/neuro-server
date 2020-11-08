import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { IpcCloseCommand, IpcOpenCommand, IpcSetOutputSynchronizationCommand, IsIpcConnectedQuery } from '@diplomka-backend/stim-feature-ipc/application';

@Injectable()
export class IpcFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async isConnected(): Promise<boolean> {
    return await this.queryBus.execute(new IsIpcConnectedQuery());
  }

  public async open(): Promise<void> {
    return await this.commandBus.execute(new IpcOpenCommand());
  }

  public async close(): Promise<void> {
    return await this.commandBus.execute(new IpcCloseCommand());
  }

  public async setOutputSynchronization(synchronize: boolean): Promise<void> {
    return await this.commandBus.execute(new IpcSetOutputSynchronizationCommand(synchronize));
  }
}
