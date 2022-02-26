import { ExperimentResultByIdHandler } from './handlers/experiment-result-by-id.handler';
import { ExperimentResultDataHandler } from './handlers/experiment-result-data.handler';
import { ExperimentResultNameExistsHandler } from './handlers/experiment-result-name-exists.handler';
import { ExperimentResultsAllHandler } from './handlers/experiment-results-all.handler';

export const QueryHandlers = [ExperimentResultsAllHandler, ExperimentResultDataHandler, ExperimentResultByIdHandler, ExperimentResultNameExistsHandler];
