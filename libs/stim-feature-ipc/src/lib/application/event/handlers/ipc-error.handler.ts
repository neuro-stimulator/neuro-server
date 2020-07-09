import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcErrorEvent } from '../impl/ipc-error.event';

@EventsHandler(IpcErrorEvent)
export class IpcErrorHandler implements IEventHandler<IpcErrorEvent> {
  private readonly logger: Logger = new Logger(IpcErrorHandler.name);

  handle(event: IpcErrorEvent): any {
    this.logger.error('Vyskytla se neočekávaná chyba v IPC komunikaci!');
    this.logger.error(event.error);
  }
}
