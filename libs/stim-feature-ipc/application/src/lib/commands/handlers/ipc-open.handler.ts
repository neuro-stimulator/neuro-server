import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcWasOpenEvent } from '../../event/impl/ipc-was-open.event';
import { IpcService } from '../../services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler extends BaseIpcBlockingHandler<IpcOpenCommand, void> {
  constructor(private readonly service: IpcService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(IpcOpenHandler.name));
  }

  protected async callServiceMethod(command: IpcOpenCommand, commandID: number): Promise<void> {
    this.service.open();
  }

  protected done(event: IpcEvent<void>, command: IpcOpenCommand | undefined): void {
    this.logger.debug('IPC socket byl úspěšně otevřen.');
    this.eventBus.publish(new IpcWasOpenEvent());
  }

  protected init(): Promise<void> {
    this.logger.debug('Budu otevírat komunikační IPC socket.');
    return super.init();
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }
}
