import { ExperimentWasCreatedHandler } from './handlers/experiment-was-created.handler';
import { ExperimentWasUpdatedHandler } from './handlers/experiment-was-updated.handler';
import { ExperimentWasDeletedHandler } from './handlers/experiment-was.deleted.handler';

export const EventHandlers = [ExperimentWasCreatedHandler, ExperimentWasUpdatedHandler, ExperimentWasDeletedHandler];
