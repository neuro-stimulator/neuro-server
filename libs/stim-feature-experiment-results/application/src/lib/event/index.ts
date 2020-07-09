import { ExperimentClearedHandler } from './handlers/experiment-cleared.handler';
import { ExperimentFinishedHandler } from './handlers/experiment-finished.handler';
import { ExperimentInitializedHandler } from './handlers/experiment-initialized.handler';
import { ExperimentResultWasCreatedHandler } from './handlers/experiment-result-was-created.handler';
import { ExperimentResultWasUpdatedHandler } from './handlers/experiment-result-was-updated.handler';
import { ExperimentResultWasDeletedHandler } from './handlers/experiment-result-was.deleted.handler';
import { ExperimentResultWasInitializedHandler } from './handlers/experiment-result-was-initialized.handler';

export const EventHandlers = [
  ExperimentClearedHandler,
  ExperimentFinishedHandler,
  ExperimentInitializedHandler,
  ExperimentResultWasCreatedHandler,
  ExperimentResultWasUpdatedHandler,
  ExperimentResultWasDeletedHandler,
  ExperimentResultWasInitializedHandler,
];
