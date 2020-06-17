import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasUpdatedEvent } from '../impl/experiment-was-updated.event';

@EventsHandler(ExperimentWasUpdatedEvent)
export class ExperimentWasUpdatedHandler
  implements IEventHandler<ExperimentWasUpdatedEvent> {
  handle(event: ExperimentWasUpdatedEvent): any {}
}
