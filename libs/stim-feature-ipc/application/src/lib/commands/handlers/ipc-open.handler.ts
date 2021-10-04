import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcWasOpenEvent } from '../../event/impl/ipc-was-open.event';
import { IpcService } from '../../services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler extends BaseIpcBlockingHandler<IpcOpenCommand, void> {
  constructor(
    @Inject(ASSET_PLAYER_MODULE_CONFIG_CONSTANT) private readonly config: AssetPlayerModuleConfig,
    private readonly service: IpcService,
    queryBus: QueryBus,
    commandIdService: CommandIdService,
    eventBus: EventBus
  ) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcOpenHandler.name));
  }

  protected async canExecute(): Promise<boolean | [boolean, string]> {
    const canExecute = this.ipcState === ConnectionStatus.CLOSED;
    return canExecute ? canExecute : [canExecute, `IPC port je ve stavu: '${ConnectionStatus[this.ipcState]}'.`];
  }

  protected async callServiceMethod(command: IpcOpenCommand, commandID: number): Promise<void> {
    this.service.open(this.config.communicationPort);
  }

  protected done(event: IpcEvent<void>, command: IpcOpenCommand): void {
    this.logger.debug('IPC socket byl úspěšně otevřen.');
    this.eventBus.publish(new IpcWasOpenEvent());
  }

  protected init(command: IpcOpenCommand): Promise<void> {
    this.logger.debug('Budu otevírat komunikační IPC socket.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
