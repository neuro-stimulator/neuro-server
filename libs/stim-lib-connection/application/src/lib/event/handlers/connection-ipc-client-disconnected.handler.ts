import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { IpcDisconnectedEvent } from '@diplomka-backend/stim-feature-ipc/application';

@EventsHandler(IpcDisconnectedEvent)
export class ConnectionIpcClientDisconnectedHandler implements IEventHandler<IpcDisconnectedEvent> {
  private readonly logger: Logger = new Logger(ConnectionIpcClientDisconnectedHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcDisconnectedEvent): Promise<void> {
    this.logger.debug('Budu informovat všechny klienty, že IPC klient se odpojil.');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(false));
  }
}
