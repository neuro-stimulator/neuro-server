import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { IpcDisconnectedEvent } from '../impl/ipc-disconnected.event';

@EventsHandler(IpcDisconnectedEvent)
export class IpcDisconnectedHandler implements IEventHandler<IpcDisconnectedEvent> {
  private readonly logger: Logger = new Logger(IpcDisconnectedHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async handle(event: IpcDisconnectedEvent): Promise<void> {
    this.logger.log(`IPC klient s id: ${event.clientID} se odpojil...`);
    this.logger.debug('Budu informovat všechny klienty, že IPC klient se odpojil.');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.DISCONNECTED));
  }
}
