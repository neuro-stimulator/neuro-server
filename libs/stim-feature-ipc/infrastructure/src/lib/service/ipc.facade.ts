import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { IpcCloseCommand, IpcKillCommand, IpcOpenCommand, IpcSpawnCommand, IpcConnectionStatusQuery } from '@diplomka-backend/stim-feature-ipc/application';

@Injectable()
export class IpcFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async status(): Promise<ConnectionStatus> {
    return this.queryBus.execute(new IpcConnectionStatusQuery());
  }

  public async open(): Promise<void> {
    return this.commandBus.execute(new IpcOpenCommand());
  }

  public async close(): Promise<void> {
    return this.commandBus.execute(new IpcCloseCommand());
  }

  public async spawn(): Promise<void> {
    return this.commandBus.execute(new IpcSpawnCommand());
  }

  public async kill(): Promise<void> {
    return this.commandBus.execute(new IpcKillCommand());
  }
}
