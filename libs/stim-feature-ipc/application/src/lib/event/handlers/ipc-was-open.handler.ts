import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcWasOpenEvent } from '../impl/ipc-was-open.event';

@EventsHandler(IpcWasOpenEvent)
export class IpcWasOpenHandler implements IEventHandler<IpcWasOpenEvent> {
  private readonly logger: Logger = new Logger(IpcWasOpenHandler.name);

  async handle(event: IpcWasOpenEvent): Promise<void> {
    this.logger.log('IPC server byl spuštěn...');
  }
}
