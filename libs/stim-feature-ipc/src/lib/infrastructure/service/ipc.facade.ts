import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { IsIpcConnectedQuery } from '../../application/queries';
import { IpcCloseCommand, IpcOpenCommand } from '../../application/commands';

@Injectable()
export class IpcFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  public async isConnected(): Promise<boolean> {
    return await this.queryBus.execute(new IsIpcConnectedQuery());
  }

  public async open(): Promise<void> {
    return await this.commandBus.execute(new IpcOpenCommand());
  }

  public async close(): Promise<void> {
    return await this.commandBus.execute(new IpcCloseCommand());
  }
}
