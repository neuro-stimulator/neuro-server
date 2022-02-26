import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { IpcWasOpenEvent } from '../impl/ipc-was-open.event';

@EventsHandler(IpcWasOpenEvent)
export class IpcWasOpenHandler implements IEventHandler<IpcWasOpenEvent> {
  private readonly logger: Logger = new Logger(IpcWasOpenHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcWasOpenEvent): Promise<void> {
    this.logger.log('IPC server byl spuštěn...');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.OPEN));
  }
}
