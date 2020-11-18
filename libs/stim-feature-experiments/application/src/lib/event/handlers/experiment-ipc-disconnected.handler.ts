import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentToggleOutputSynchronizationMessage, MessageCodes } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { IpcDisconnectedEvent } from '@diplomka-backend/stim-feature-ipc/application';

@EventsHandler(IpcDisconnectedEvent)
export class ExperimentIpcDisconnectedHandler implements IEventHandler<IpcDisconnectedEvent> {
  private readonly logger: Logger = new Logger(ExperimentIpcDisconnectedHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcDisconnectedEvent): Promise<void> {
    this.logger.debug('Vypínám synchronizaci výstupů na klientovi.');
    await this.facade.broadcastCommand(new ExperimentToggleOutputSynchronizationMessage(false, { code: MessageCodes.CODE_ERROR_EXPERIMENT_OUTPUT_SYNCHRONIZATION_DISABLED }));
  }
}
