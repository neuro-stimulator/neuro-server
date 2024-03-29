import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { ServerPublicPathMessage } from '@neuro-server/stim-feature-ipc/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcService } from '../../services/ipc.service';
import { IpcSetPublicPathCommand } from '../impl/ipc-set-public-path.command';

import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcSetPublicPathCommand)
export class IpcSetPublicPathHandler extends BaseIpcBlockingHandler<IpcSetPublicPathCommand, void> {
  constructor(private readonly service: IpcService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcSetPublicPathHandler.name));
  }

  protected async callServiceMethod(command: IpcSetPublicPathCommand, commandID: number): Promise<void> {
    this.service.send(new ServerPublicPathMessage(command.publicPath, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcSetPublicPathCommand): void {
    this.logger.debug('Cesta k veřejné složce byla úspěšně odeslána.');
  }

  protected init(command: IpcSetPublicPathCommand): Promise<void> {
    this.logger.debug('Budu odesílat informaci s umístěním veřejné složky pro přístup k assetům do přehrávače multimédií.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
