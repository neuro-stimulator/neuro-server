import { ExperimentWasCreatedHandler } from './handlers/experiment-was-created.handler';
import { ExperimentWasUpdatedHandler } from './handlers/experiment-was-updated.handler';
import { ExperimentWasDeletedHandler } from './handlers/experiment-was.deleted.handler';
import { ApplicationReadyHandler } from './handlers/application-ready.handler';

export const EventHandlers = [ExperimentWasCreatedHandler, ExperimentWasUpdatedHandler, ExperimentWasDeletedHandler, ApplicationReadyHandler];
