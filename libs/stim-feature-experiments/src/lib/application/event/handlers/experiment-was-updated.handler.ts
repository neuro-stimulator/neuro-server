import { IEventHandler } from '@nestjs/cqrs';

import { ExperimentWasUpdatedEvent } from '../impl/experiment-was-updated.event';

export class ExperimentWasUpdatedHandler
  implements IEventHandler<ExperimentWasUpdatedEvent> {
  handle(event: ExperimentWasUpdatedEvent): any {}
}
