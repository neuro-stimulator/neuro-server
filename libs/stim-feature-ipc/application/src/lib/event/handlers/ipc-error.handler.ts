import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { IpcErrorEvent } from '../impl/ipc-error.event';

@EventsHandler(IpcErrorEvent)
export class IpcErrorHandler implements IEventHandler<IpcErrorEvent> {
  private readonly logger: Logger = new Logger(IpcErrorHandler.name);

  async handle(event: IpcErrorEvent): Promise<void> {
    this.logger.error('Vyskytla se neočekávaná chyba v IPC komunikaci!');
    this.logger.error(event.error);
  }
}
