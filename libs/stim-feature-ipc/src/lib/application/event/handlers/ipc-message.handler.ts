import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcMessageEvent } from '../impl/ipc-message.event';

@EventsHandler(IpcMessageEvent)
export class IpcMessageHandler implements IEventHandler<IpcMessageEvent> {
  private readonly logger: Logger = new Logger(IpcMessageHandler.name);

  handle(event: IpcMessageEvent): any {
    this.logger.log('Přišla nová zpráva od IPC klienta...');
    this.logger.debug(event);
  }
}
