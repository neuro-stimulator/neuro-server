import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasCreatedEvent } from '../impl/experiment-was-created.event';

@EventsHandler(ExperimentWasCreatedEvent)
export class ExperimentWasCreatedHandler implements IEventHandler<ExperimentWasCreatedEvent> {
  handle(event: ExperimentWasCreatedEvent): any {}
}
