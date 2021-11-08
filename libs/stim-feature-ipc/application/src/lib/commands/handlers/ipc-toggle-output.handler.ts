import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@neuro-server/stim-lib-common';
import { ToggleOutputMessage } from '@neuro-server/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcToggleOutputCommand } from '../impl/ipc-toggle-output.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcToggleOutputCommand)
export class IpcToggleOutputHandler extends BaseIpcBlockingHandler<IpcToggleOutputCommand, void> {
  constructor(private readonly service: IpcService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcToggleOutputHandler.name));
  }

  protected async callServiceMethod(command: IpcToggleOutputCommand, commandID: number): Promise<void> {
    this.service.send(new ToggleOutputMessage(command.index, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcToggleOutputCommand): void {
    this.logger.debug('Jeden konkrétní výstup byl úspěšně nastaven.');
  }

  protected init(command: IpcToggleOutputCommand): Promise<void> {
    this.logger.debug('Budu nastavovat jeden konkrétní výstup v přehrávači multimédií.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
