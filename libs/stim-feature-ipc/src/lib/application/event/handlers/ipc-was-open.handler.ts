import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcWasOpenEvent } from '../impl/ipc-was-open.event';

@EventsHandler(IpcWasOpenEvent)
export class IpcWasOpenHandler implements IEventHandler<IpcWasOpenEvent> {
  private readonly logger: Logger = new Logger(IpcWasOpenHandler.name);

  handle(event: IpcWasOpenEvent): any {
    this.logger.log('IPC server byl spuštěn...');
  }
}
