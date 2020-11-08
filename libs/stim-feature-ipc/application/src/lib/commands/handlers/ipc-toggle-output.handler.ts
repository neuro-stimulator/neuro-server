import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { ToggleOutputMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcToggleOutputCommand } from '../impl/ipc-toggle-output.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcToggleOutputCommand)
export class IpcToggleOutputHandler extends BaseIpcBlockingHandler<IpcToggleOutputCommand, void> {
  constructor(private readonly service: IpcService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(IpcToggleOutputHandler.name));
  }

  protected async callServiceMethod(command: IpcToggleOutputCommand, commandID: number): Promise<void> {
    this.service.send(new ToggleOutputMessage(command.index, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcToggleOutputCommand | undefined): void {
    this.logger.debug('Jeden konkrétní výstup byl úspěšně nastaven.');
    // this.logger.debug('IPC socket byl úspěšně uzavřen.');
    // this.eventBus.publish(new IpcClosedEvent());
  }

  protected init(): Promise<void> {
    this.logger.debug('Budu nastavovat jeden konkrétní výstup v přehrávači multimédií.');
    return super.init();
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }
}
