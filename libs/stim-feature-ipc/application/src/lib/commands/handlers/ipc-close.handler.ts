import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@neuro-server/stim-lib-common';

import { IpcClosedEvent } from '../../event/impl/ipc-closed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcService } from '../../services/ipc.service';
import { IpcCloseCommand } from '../impl/ipc-close.command';

import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcCloseCommand)
export class IpcCloseHandler extends BaseIpcBlockingHandler<IpcCloseCommand, void> {
  constructor(private readonly service: IpcService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcCloseHandler.name));
  }

  protected async canExecute(): Promise<boolean | [boolean, string]> {
    const canExecute = this.ipcState === ConnectionStatus.DISCONNECTED;
    return canExecute ? canExecute : [canExecute, `IPC port je ve stavu: '${ConnectionStatus[this.ipcState]}'.`];
  }

  protected async callServiceMethod(command: IpcCloseCommand, commandID: number): Promise<void> {
    this.service.close();
  }

  protected done(event: IpcEvent<void>, command: IpcCloseCommand): void {
    this.logger.debug('IPC socket byl úspěšně uzavřen.');
    this.eventBus.publish(new IpcClosedEvent());
  }

  protected init(command: IpcCloseCommand): Promise<void> {
    this.logger.debug('Budu zavírat komunikační IPC socket.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
