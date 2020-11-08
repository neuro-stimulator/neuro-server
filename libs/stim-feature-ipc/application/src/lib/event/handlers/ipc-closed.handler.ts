import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcClosedEvent } from '../impl/ipc-closed.event';

@EventsHandler(IpcClosedEvent)
export class IpcClosedHandler implements IEventHandler<IpcClosedEvent> {
  private readonly logger: Logger = new Logger(IpcClosedHandler.name);

  async handle(event: IpcClosedEvent): Promise<void> {
    this.logger.log('IPC byla uzavřena...');
  }
}
