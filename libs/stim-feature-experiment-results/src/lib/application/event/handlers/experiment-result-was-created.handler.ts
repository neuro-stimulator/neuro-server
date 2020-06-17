import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentResultWasCreatedEvent } from '../impl/experiment-result-was-created.event';

@EventsHandler(ExperimentResultWasCreatedEvent)
export class ExperimentResultWasCreatedHandler
  implements IEventHandler<ExperimentResultWasCreatedEvent> {
  handle(event: ExperimentResultWasCreatedEvent): any {}
}
