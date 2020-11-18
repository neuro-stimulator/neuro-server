import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorStateChangeMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSendStimulatorStateChangeCommand } from '../impl/ipc-send-stimulator-state-change.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcSendStimulatorStateChangeCommand)
export class IpcSendStimulatorStateChangeHandler extends BaseIpcBlockingHandler<IpcSendStimulatorStateChangeCommand, void> {
  constructor(private readonly service: IpcService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(IpcSendStimulatorStateChangeHandler.name));
  }

  protected async callServiceMethod(command: IpcSendStimulatorStateChangeCommand, commandID: number): Promise<void> {
    this.service.send(new StimulatorStateChangeMessage(command.state, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcSendStimulatorStateChangeCommand | undefined): void {
    this.logger.debug('Nový stav stimulátoru byl úspěšně odeslán.');
    // this.logger.debug('IPC socket byl úspěšně uzavřen.');
    // this.eventBus.publish(new IpcClosedEvent());
  }

  protected init(command: IpcSendStimulatorStateChangeCommand): Promise<void> {
    this.logger.debug('Budu odesílát nový stav stimulátoru do přehrávače multimédií.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }
}
