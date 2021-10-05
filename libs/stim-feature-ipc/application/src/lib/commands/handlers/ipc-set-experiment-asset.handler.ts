import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { ExperientAssetsMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSetExperimentAssetCommand } from '../impl/ipc-set-experiment-asset.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcSetExperimentAssetCommand)
export class IpcSetExperimentAssetHandler extends BaseIpcBlockingHandler<IpcSetExperimentAssetCommand, void> {
  constructor(private readonly service: IpcService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcSetExperimentAssetHandler.name));
  }

  protected async callServiceMethod(command: IpcSetExperimentAssetCommand, commandID: number): Promise<void> {
    this.service.send(new ExperientAssetsMessage(command.data, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcSetExperimentAssetCommand): void {
    this.logger.debug('Informace o assetech byla úspěšně odeslána.');
  }

  protected init(command: IpcSetExperimentAssetCommand): Promise<void> {
    this.logger.debug('Budu odesílat informaci o assetech aktuálního experimentu do přehrávače multimédií.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
