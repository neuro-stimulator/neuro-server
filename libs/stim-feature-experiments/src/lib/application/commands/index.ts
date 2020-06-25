import { ExperimentInsertHandler } from './handlers/experiment-insert.handler';
import { ExperimentUpdateHandler } from './handlers/experiment-update.handler';
import { ExperimentDeleteHandler } from './handlers/experiment-delete.handler';
import { ExperimentValidateHandler } from './handlers/experiment-validate.handler';

export const CommandHandlers = [
  ExperimentInsertHandler,
  ExperimentUpdateHandler,
  ExperimentDeleteHandler,
  ExperimentValidateHandler,
];

export * from './impl/experiment-insert.command';
export * from './impl/experiment-update.command';
export * from './impl/experiment-delete.command';
export * from './impl/experiment-validate.command';
