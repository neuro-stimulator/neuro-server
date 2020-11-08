import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { ServerPublicPathMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSetPublicPathCommand } from '../impl/ipc-set-public-path.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcSetPublicPathCommand)
export class IpcSetPublicPathHandler extends BaseIpcBlockingHandler<IpcSetPublicPathCommand, void> {
  constructor(private readonly service: IpcService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(IpcSetPublicPathHandler.name));
  }

  protected async callServiceMethod(command: IpcSetPublicPathCommand, commandID: number): Promise<void> {
    this.service.send(new ServerPublicPathMessage(command.publicPath, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcSetPublicPathCommand | undefined): void {
    this.logger.debug('Cesta k veřejné složce byla úspěšně odeslána.');
    // this.logger.debug('IPC socket byl úspěšně uzavřen.');
    // this.eventBus.publish(new IpcClosedEvent());
  }

  protected init(): Promise<void> {
    this.logger.debug('Budu odesílat informaci s umístěním veřejné složky pro přístup k assetům do přehrávače multimédií.');
    return super.init();
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }
}
