import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcOpenEvent } from '../impl/ipc-open.event';

@EventsHandler(IpcOpenEvent)
export class IpcOpenHandler implements IEventHandler<IpcOpenEvent> {
  private readonly logger: Logger = new Logger(IpcOpenHandler.name);

  handle(event: IpcOpenEvent): any {
    this.logger.log('IPC server byl spuštěn...');
  }
}
