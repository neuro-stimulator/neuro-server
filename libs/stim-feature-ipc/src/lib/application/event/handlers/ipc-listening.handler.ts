import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcListeningEvent } from '../impl/ipc-listening.event';

@EventsHandler(IpcListeningEvent)
export class IpcListeningHandler implements IEventHandler<IpcListeningEvent> {
  private readonly logger: Logger = new Logger(IpcListeningHandler.name);

  handle(event: IpcListeningEvent): any {
    this.logger.log('IPC služba čeká na připojení klinta...');
  }
}
