import { Logger } from '@nestjs/common';
import { EventBus, IEvent, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus, Settings } from '@stechy1/diplomka-share';

import { BaseBlockingHandler, CommandIdService } from '@neuro-server/stim-lib-common';
import { GetSettingsQuery } from '@neuro-server/stim-feature-settings';
import { IpcCommandType, IpcMessage } from '@neuro-server/stim-feature-ipc/domain';

import { IpcBlockingCommandFailedEvent } from '../../../event/impl/ipc-blocking-command-failed.event';
import { IpcEvent } from '../../../event/impl/ipc.event';
import { IpcBlockingCommand } from '../../impl/base/ipc-blocking.command';

export abstract class BaseIpcBlockingHandler<TCommand extends IpcBlockingCommand, MType> extends BaseBlockingHandler<TCommand, IpcCommandType, IpcEvent<MType>, IpcMessage<MType>> {
  private _timeOut: number;

  protected constructor(private readonly queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus, logger: Logger) {
    super(commandIdService, eventBus, logger);
  }

  protected async canExecute(): Promise<boolean | [boolean, string]> {
    const canExecute = this.ipcState === ConnectionStatus.CONNECTED;
    return canExecute ? canExecute : [canExecute, `IPC port je ve stavu: '${ConnectionStatus[this.ipcState]}'.`];
  }

  protected async init(command: TCommand): Promise<void> {
    const settings: Settings = await this.queryBus.execute(new GetSettingsQuery());
    this._timeOut = settings.assetPlayerResponseTimeout;
  }

  protected provideBlockingFailedEvent(commandType: IpcCommandType): IEvent {
    return new IpcBlockingCommandFailedEvent(commandType);
  }

  protected isRequestedEvent(event: IEvent): boolean {
    return event instanceof IpcEvent;
  }

  protected get timeoutValue(): number {
    return this._timeOut;
  }

  protected abstract get ipcState(): ConnectionStatus;
}
