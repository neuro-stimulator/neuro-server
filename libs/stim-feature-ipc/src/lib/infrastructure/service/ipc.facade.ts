import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { IsIpcConnectedQuery } from '../../application/queries/impl/is-ipc-connected.query';
import { IpcOpenCommand } from '../../application/commands/impl/ipc-open.command';
import { IpcCloseCommand } from '../../application/commands/impl/ipc-close.command';
import { IpcMessage } from '../../domain/model/ipc-message';
import { IpcSendMessageCommand } from '../../application/commands/impl/ipc-send-message.command';

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

  public async sendMessage<T>(ipcMessage: IpcMessage<T>): Promise<void> {
    return this.commandBus.execute(new IpcSendMessageCommand<T>(ipcMessage));
  }
}
