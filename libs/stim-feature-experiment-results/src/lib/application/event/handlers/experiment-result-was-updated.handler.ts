import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentResultWasUpdatedEvent } from '../impl/experiment-result-was-updated.event';

@EventsHandler(ExperimentResultWasUpdatedEvent)
export class ExperimentResultWasUpdatedHandler
  implements IEventHandler<ExperimentResultWasUpdatedEvent> {
  handle(event: ExperimentResultWasUpdatedEvent): any {}
}
