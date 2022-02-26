import { ExperimentResultDeleteHandler } from './handlers/experiment-result-delete.handler';
import { ExperimentResultInsertHandler } from './handlers/experiment-result-insert.handler';
import { ExperimentResultUpdateHandler } from './handlers/experiment-result-update.handler';
import { ExperimentResultValidateHandler } from './handlers/experiment-result-validate.handler';
import { InitializeExperimentResultsDirectoryHandler } from './handlers/initialize-experiment-results-directory.handler';
import { SendExperimentResultCreatedToClientHandler } from './handlers/to-client/send-experiment-result-created-to-client.handler';
import { WriteExperimentResultToFileHandler } from './handlers/write-experiment-result-to-file.handler';

export const CommandHandlers = [
  ExperimentResultInsertHandler,
  ExperimentResultUpdateHandler,
  ExperimentResultDeleteHandler,
  ExperimentResultValidateHandler,
  WriteExperimentResultToFileHandler,
  InitializeExperimentResultsDirectoryHandler,
  SendExperimentResultCreatedToClientHandler,
];
