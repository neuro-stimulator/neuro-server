import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcWasOpenEvent } from '../../event/impl/ipc-was-open.event';
import { IpcService } from '../../services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';
import { TOKEN_COMMUNICATION_PORT } from '@diplomka-backend/stim-feature-ipc/domain';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler extends BaseIpcBlockingHandler<IpcOpenCommand, void> {
  constructor(
    @Inject(TOKEN_COMMUNICATION_PORT) private readonly port: number,
    private readonly service: IpcService,
    settings: SettingsFacade,
    commandIdService: CommandIdService,
    eventBus: EventBus
  ) {
    super(settings, commandIdService, eventBus, new Logger(IpcOpenHandler.name));
  }

  protected async callServiceMethod(command: IpcOpenCommand, commandID: number): Promise<void> {
    this.service.open(this.port);
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
}
