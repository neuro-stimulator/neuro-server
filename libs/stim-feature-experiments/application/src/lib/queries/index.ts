import { ExperimentsAllHandler } from './handlers/experiments-all.handler';
import { ExperimentByIdHandler } from './handlers/experiment-by-id.handler';
import { ExperimentMultimediaHandler } from './handlers/experiment-multimedia.handler';
import { ExperimentNameExistsHandler } from './handlers/experiment-name-exists.handler';

export const QueryHandlers = [ExperimentsAllHandler, ExperimentByIdHandler, ExperimentMultimediaHandler, ExperimentNameExistsHandler];
