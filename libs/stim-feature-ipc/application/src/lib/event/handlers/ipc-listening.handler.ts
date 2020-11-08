import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcListeningEvent } from '../impl/ipc-listening.event';

@EventsHandler(IpcListeningEvent)
export class IpcListeningHandler implements IEventHandler<IpcListeningEvent> {
  private readonly logger: Logger = new Logger(IpcListeningHandler.name);

  async handle(event: IpcListeningEvent): Promise<void> {
    this.logger.log('IPC služba čeká na připojení klienta...');
  }
}
