import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasDeletedEvent } from '../impl/experiment-was-deleted.event';

@EventsHandler(ExperimentWasDeletedEvent)
export class ExperimentWasDeletedHandler implements IEventHandler {
  handle(event: any): any {}
}
