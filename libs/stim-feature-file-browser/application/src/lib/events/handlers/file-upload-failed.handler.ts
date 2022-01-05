import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FileUploadFailedEvent } from '../impl/file-upload-failed.event';

@EventsHandler(FileUploadFailedEvent)
export class FileUploadFailedHandler implements IEventHandler<FileUploadFailedEvent> {
  private readonly logger: Logger = new Logger(FileUploadFailedHandler.name);

  async handle(event: FileUploadFailedEvent): Promise<void> {
    this.logger.error(`Soubor: ${event.path} se nepodařilo nahrát!`);
  }
}
