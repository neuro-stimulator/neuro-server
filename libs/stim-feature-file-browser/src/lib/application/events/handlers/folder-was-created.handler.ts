import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FolderWasCreatedEvent } from '@diplomka-backend/stim-feature-file-browser';
import { Logger } from '@nestjs/common';

@EventsHandler(FolderWasCreatedEvent)
export class FolderWasCreatedHandler
  implements IEventHandler<FolderWasCreatedEvent> {
  private readonly logger: Logger = new Logger(FolderWasCreatedHandler.name);

  handle(event: FolderWasCreatedEvent): any {
    this.logger.debug(`Složka '${event.path}' byla úspěšně vytvořena.`);
  }
}
