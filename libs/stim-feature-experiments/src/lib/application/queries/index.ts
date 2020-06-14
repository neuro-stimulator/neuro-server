import { ExperimentsAllHandler } from './handlers/experiments-all.handler';
import { ExperimentByIdHandler } from './handlers/experiment-by-id.handler';
import { ExperimentMultimediaHandler } from './handlers/experiment-multimedia.handler';
import { ExperimentNameExistsHandler } from './handlers/experiment-name-exists.handler';

export const QueryHandlers = [
  ExperimentsAllHandler,
  ExperimentByIdHandler,
  ExperimentMultimediaHandler,
  ExperimentNameExistsHandler,
];

export * from './handlers/experiments-all.handler';
export * from './handlers/experiment-by-id.handler';
export * from './handlers/experiment-multimedia.handler';
export * from './handlers/experiment-name-exists.handler';

export * from './impl/experiments-all.query';
export * from './impl/experiment-by-id.query';
export * from './impl/experiment-multimedia.query';
export * from './impl/experiment-name-exists.query';
