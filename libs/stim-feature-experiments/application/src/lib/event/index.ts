import { ExperimentIpcDisconnectedHandler } from './handlers/experiment-ipc-disconnected.handler';
import { ExperimentWasCreatedHandler } from './handlers/experiment-was-created.handler';
import { ExperimentWasUpdatedHandler } from './handlers/experiment-was-updated.handler';
import { ExperimentWasDeletedHandler } from './handlers/experiment-was.deleted.handler';
import { ExperimentsApplicationReadyHandler } from './handlers/experiments-application-ready.handler';

export const EventHandlers = [
  ExperimentWasCreatedHandler,
  ExperimentWasUpdatedHandler,
  ExperimentWasDeletedHandler,
  ExperimentsApplicationReadyHandler,
  ExperimentIpcDisconnectedHandler,
];
