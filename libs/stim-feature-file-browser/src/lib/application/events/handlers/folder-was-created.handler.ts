import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FolderWasCreatedEvent } from '@diplomka-backend/stim-feature-file-browser';

@EventsHandler(FolderWasCreatedEvent)
export class FolderWasCreatedHandler
  implements IEventHandler<FolderWasCreatedEvent> {
  private readonly logger: Logger = new Logger(FolderWasCreatedHandler.name);

  async handle(event: FolderWasCreatedEvent): Promise<any> {
    this.logger.debug(`Složka '${event.path}' byla úspěšně vytvořena.`);
  }
}
