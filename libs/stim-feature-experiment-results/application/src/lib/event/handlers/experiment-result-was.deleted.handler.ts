import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentResultWasDeletedEvent } from '../impl/experiment-result-was-deleted.event';

@EventsHandler(ExperimentResultWasDeletedEvent)
export class ExperimentResultWasDeletedHandler implements IEventHandler {
  handle(event: any): any {}
}
