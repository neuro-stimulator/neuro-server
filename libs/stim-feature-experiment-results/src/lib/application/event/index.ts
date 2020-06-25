import { ExperimentResultWasCreatedHandler } from './handlers/experiment-result-was-created.handler';
import { ExperimentResultWasUpdatedHandler } from './handlers/experiment-result-was-updated.handler';
import { ExperimentResultWasDeletedHandler } from './handlers/experiment-result-was.deleted.handler';
import { ExperimentResultWasInitializedHandler } from './handlers/experiment-result-was-initialized.handler';

export const EventHandlers = [
  ExperimentResultWasCreatedHandler,
  ExperimentResultWasUpdatedHandler,
  ExperimentResultWasDeletedHandler,
  ExperimentResultWasInitializedHandler,
];

export * from './impl/experiment-result-was-created.event';
export * from './impl/experiment-result-was-updated.event';
export * from './impl/experiment-result-was-deleted.event';
export * from './impl/experiment-result-was-initialized.event';
