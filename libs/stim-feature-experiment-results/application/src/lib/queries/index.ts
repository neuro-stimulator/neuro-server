import { ExperimentResultsAllHandler } from './handlers/experiment-results-all.handler';
import { ExperimentResultDataHandler } from './handlers/experiment-result-data.handler';
import { ExperimentResultByIdHandler } from './handlers/experiment-result-by-id.handler';
import { ExperimentResultNameExistsHandler } from './handlers/experiment-result-name-exists.handler';

export const QueryHandlers = [ExperimentResultsAllHandler, ExperimentResultDataHandler, ExperimentResultByIdHandler, ExperimentResultNameExistsHandler];
