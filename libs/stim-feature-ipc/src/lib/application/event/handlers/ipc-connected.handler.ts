import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcConnectedEvent } from '../impl/ipc-connected.event';

@EventsHandler(IpcConnectedEvent)
export class IpcConnectedHandler implements IEventHandler<IpcConnectedEvent> {
  private readonly logger: Logger = new Logger(IpcConnectedHandler.name);

  handle(event: IpcConnectedEvent): any {
    this.logger.log(`IPC klient s id: ${event.clientID} se připojil...`);
  }
}
