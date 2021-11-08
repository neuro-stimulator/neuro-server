import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@neuro-server/stim-lib-common';
import { StimulatorStateChangeMessage } from '@neuro-server/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSendStimulatorStateChangeCommand } from '../impl/ipc-send-stimulator-state-change.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';

@CommandHandler(IpcSendStimulatorStateChangeCommand)
export class IpcSendStimulatorStateChangeHandler extends BaseIpcBlockingHandler<IpcSendStimulatorStateChangeCommand, void> {
  constructor(private readonly service: IpcService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(IpcSendStimulatorStateChangeHandler.name));
  }

  protected async callServiceMethod(command: IpcSendStimulatorStateChangeCommand, commandID: number): Promise<void> {
    this.service.send(new StimulatorStateChangeMessage(command.state, commandID));
  }

  protected done(event: IpcEvent<void>, command: IpcSendStimulatorStateChangeCommand): void {
    this.logger.debug('Nový stav stimulátoru byl úspěšně odeslán.');
  }

  protected init(command: IpcSendStimulatorStateChangeCommand): Promise<void> {
    this.logger.debug('Budu odesílát nový stav stimulátoru do přehrávače multimédií.');
    return super.init(command);
  }

  protected isValid(event: IpcEvent<void>): boolean {
    return false;
  }

  protected get ipcState(): ConnectionStatus {
    return this.service.status;
  }
}
