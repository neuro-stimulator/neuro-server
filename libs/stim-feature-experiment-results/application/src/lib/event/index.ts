import { ExperimentResultWasCreatedHandler } from './handlers/experiment-result-was-created.handler';
import { ExperimentResultWasUpdatedHandler } from './handlers/experiment-result-was-updated.handler';
import { ExperimentResultWasDeletedHandler } from './handlers/experiment-result-was.deleted.handler';

export const EventHandlers = [ExperimentResultWasCreatedHandler, ExperimentResultWasUpdatedHandler, ExperimentResultWasDeletedHandler];
