import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import {
  IpcOutputSynchronizationExperimentIdMissingException,
  OutputSynchronizationStateChangedMessage,
  ToggleOutputSynchronizationMessage,
} from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcService } from '../../services/ipc.service';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSetOutputSynchronizationCommand } from '../impl/ipc-set-output-synchronization.command';
import { BaseIpcBlockingHandler } from './base/base-ipc-blocking.handler';
import { IpcOutputSynchronizationUpdatedEvent } from '../../event/impl/ipc-output-synchronization-updated.event';

@CommandHandler(IpcSetOutputSynchronizationCommand)
export class IpcSetOutputSynchronizationHandler extends BaseIpcBlockingHandler<IpcSetOutputSynchronizationCommand, OutputSynchronizationStateChangedMessage> {
  constructor(private readonly service: IpcService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(IpcSetOutputSynchronizationHandler.name));
  }

  protected async callServiceMethod(command: IpcSetOutputSynchronizationCommand, commandID: number): Promise<void> {
    this.service.send(new ToggleOutputSynchronizationMessage(command.synchronize, commandID));
  }

  protected done(event: IpcEvent<OutputSynchronizationStateChangedMessage>, command: IpcSetOutputSynchronizationCommand | undefined): void {
    this.logger.debug('Synchronizace obrázků byla úspěšně nastavena.');
    this.eventBus.publish(new IpcOutputSynchronizationUpdatedEvent(command.synchronize, command.userID, command.experimentID));
  }

  protected init(command: IpcSetOutputSynchronizationCommand): Promise<void> {
    this.logger.debug('Budu nastavovat synchronizaci obrázků mezí editorem výstupů a přehrávačem multimédií.');
    this.logger.debug('Zkontroluji validitu parametrů.');
    if (command.synchronize && !command.experimentID) {
      throw new IpcOutputSynchronizationExperimentIdMissingException();
    }

    return super.init(command);
  }

  protected isValid(event: IpcEvent<OutputSynchronizationStateChangedMessage>): boolean {
    return event.topic == OutputSynchronizationStateChangedMessage.name;
  }
}