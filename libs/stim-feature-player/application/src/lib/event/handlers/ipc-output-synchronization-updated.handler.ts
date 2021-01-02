import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcOutputSynchronizationUpdatedEvent, IpcSetOutputSynchronizationCommand } from '@diplomka-backend/stim-feature-ipc/application';

import { SendAssetConfigurationToIpcCommand } from '../../commands/impl/to-ipc/send-asset-configuration-to-ipc.command';

@EventsHandler(IpcOutputSynchronizationUpdatedEvent)
export class IpcOutputSynchronizationUpdatedHandler implements IEventHandler<IpcOutputSynchronizationUpdatedEvent> {
  private readonly logger: Logger = new Logger(IpcOutputSynchronizationUpdatedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: IpcOutputSynchronizationUpdatedEvent): Promise<void> {
    if (!event.synchronize) {
      this.logger.debug('Synchronizace výstupů byla vypnuta.');
      return;
    }

    this.logger.debug('Synchronizace výstupů byla zapnuta.');
    if (!event.experimentID) {
      this.logger.error('ID experimentu nebylo definováno. Vypínám synchronizaci výstupů.');
      await this.commandBus.execute(new IpcSetOutputSynchronizationCommand(false));
      return;
    }

    if (event.userID === undefined) {
      this.logger.error('Nemůžu aktualizovat synchronizaci výstupů, protože není definováno userID!');
      return;
    }

    await this.commandBus.execute(new SendAssetConfigurationToIpcCommand(event.userID, event.experimentID));
  }
}
