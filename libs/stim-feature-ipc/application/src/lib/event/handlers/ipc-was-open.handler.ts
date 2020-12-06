import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcWasOpenEvent } from '../impl/ipc-was-open.event';
import { SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

@EventsHandler(IpcWasOpenEvent)
export class IpcWasOpenHandler implements IEventHandler<IpcWasOpenEvent> {
  private readonly logger: Logger = new Logger(IpcWasOpenHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcWasOpenEvent): Promise<void> {
    this.logger.log('IPC server byl spuštěn...');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.OPEN));
  }
}
