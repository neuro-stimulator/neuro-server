import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileWasUploadedEvent } from '@diplomka-backend/stim-feature-file-browser';

@EventsHandler(FileWasUploadedEvent)
export class FileWasUploadedHandler
  implements IEventHandler<FileWasUploadedEvent> {
  private readonly logger: Logger = new Logger(FileWasUploadedHandler.name);

  async handle(event: FileWasUploadedEvent): Promise<any> {
    this.logger.debug(`Soubor: ${event.path} byl úspěšně nahrán na server.`);
  }
}
