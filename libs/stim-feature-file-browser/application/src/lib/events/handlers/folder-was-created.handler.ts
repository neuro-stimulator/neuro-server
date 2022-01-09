import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FolderWasCreatedEvent } from '../impl/folder-was-created.event';

@EventsHandler(FolderWasCreatedEvent)
export class FolderWasCreatedHandler implements IEventHandler<FolderWasCreatedEvent> {
  private readonly logger: Logger = new Logger(FolderWasCreatedHandler.name);

  async handle(event: FolderWasCreatedEvent): Promise<void> {
    this.logger.debug(`Složka '${event.path}' byla úspěšně vytvořena.`);
  }
}
