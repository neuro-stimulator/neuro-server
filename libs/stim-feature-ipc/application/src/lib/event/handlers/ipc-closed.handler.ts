import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { IpcClosedEvent } from '../impl/ipc-closed.event';

@EventsHandler(IpcClosedEvent)
export class IpcClosedHandler implements IEventHandler<IpcClosedEvent> {
  private readonly logger: Logger = new Logger(IpcClosedHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcClosedEvent): Promise<void> {
    this.logger.log('IPC byla uzavřena...');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.CLOSED));
  }
}
