import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcDisconnectedEvent } from '../impl/ipc-disconnected.event';

@EventsHandler(IpcDisconnectedEvent)
export class IpcDisconnectedHandler implements IEventHandler<IpcDisconnectedEvent> {
  private readonly logger: Logger = new Logger(IpcDisconnectedHandler.name);

  async handle(event: IpcDisconnectedEvent): Promise<void> {
    this.logger.log(`IPC klient s id: ${event.clientID} se odpojil...`);
  }
}
