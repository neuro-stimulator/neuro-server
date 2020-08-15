import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { IpcConnectedEvent } from '@diplomka-backend/stim-feature-ipc';

@EventsHandler(IpcConnectedEvent)
export class ConnectionIpcClientConnectedHandler implements IEventHandler<IpcConnectedEvent> {
  private readonly logger: Logger = new Logger(ConnectionIpcClientConnectedHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcConnectedEvent): Promise<void> {
    this.logger.debug('Budu informovat všechny klienty, že IPC klient se připojil.');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(true));
  }
}
