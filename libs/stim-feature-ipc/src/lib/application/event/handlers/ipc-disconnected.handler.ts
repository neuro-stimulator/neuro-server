import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcDisconnectedEvent } from '../impl/ipc-disconnected.event';

@EventsHandler(IpcDisconnectedEvent)
export class IpcDisconnectedHandler
  implements IEventHandler<IpcDisconnectedEvent> {
  private readonly logger: Logger = new Logger(IpcDisconnectedHandler.name);

  handle(event: IpcDisconnectedEvent): any {
    this.logger.log(`IPC klient s id: ${event.clientID} se odpojil...`);
  }
}
