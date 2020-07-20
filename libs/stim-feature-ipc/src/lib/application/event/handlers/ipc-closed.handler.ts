import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcClosedEvent } from '../impl/ipc-closed.event';

@EventsHandler(IpcClosedEvent)
export class IpcClosedHandler implements IEventHandler<IpcClosedEvent> {
  private readonly logger: Logger = new Logger(IpcClosedHandler.name);
  handle(event: IpcClosedEvent): any {
    this.logger.log('IPC byla uzavřena...');
  }
}
