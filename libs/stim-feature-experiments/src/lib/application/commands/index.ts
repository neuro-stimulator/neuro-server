import { ExperimentInsertHandler } from './handlers/experiment-insert.handler';
import { ExperimentUpdateHandler } from './handlers/experiment-update.handler';
import { ExperimentDeleteHandler } from './handlers/experiment-delete.handler';

export const CommandHandlers = [
  ExperimentInsertHandler,
  ExperimentUpdateHandler,
  ExperimentDeleteHandler,
];

export * from './handlers/experiment-insert.handler';
export * from './handlers/experiment-update.handler';
export * from './handlers/experiment-delete.handler';

export * from './impl/experiment-insert.command';
export * from './impl/experiment-update.command';
export * from './impl/experiment-delete.command';
