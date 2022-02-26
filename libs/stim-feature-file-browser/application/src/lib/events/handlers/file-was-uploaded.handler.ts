import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FileWasUploadedEvent } from '../impl/file-was-uploaded.event';

@EventsHandler(FileWasUploadedEvent)
export class FileWasUploadedHandler implements IEventHandler<FileWasUploadedEvent> {
  private readonly logger: Logger = new Logger(FileWasUploadedHandler.name);

  async handle(event: FileWasUploadedEvent): Promise<void> {
    this.logger.debug(`Soubor: ${event.path} byl úspěšně nahrán na server.`);
  }
}
