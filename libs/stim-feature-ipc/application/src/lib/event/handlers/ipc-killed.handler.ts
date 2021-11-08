import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { IpcKilledEvent } from '../impl/ipc-killed.event';

@EventsHandler(IpcKilledEvent)
export class IpcKilledHandler implements IEventHandler<IpcKilledEvent> {
  private readonly logger: Logger = new Logger(IpcKilledHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcKilledEvent): Promise<void> {
    this.logger.log('Asset player byl ukončen...');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.DISCONNECTED));
  }
}
