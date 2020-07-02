import { ExperimentResultInsertHandler } from './handlers/experiment-result-insert.handler';
import { ExperimentResultUpdateHandler } from './handlers/experiment-result-update.handler';
import { ExperimentResultDeleteHandler } from './handlers/experiment-result-delete.handler';
import { ExperimentResultInitializeHandler } from './handlers/experiment-result-initialize.handler';
import { ExperimentResultValidateHandler } from './handlers/experiment-result-validate.handler';
import { WriteExperimentResultToFileHandler } from './handlers/write-experiment-result-to-file.handler';
import { InitializeExperimentResultsDirectoryHandler } from './handlers/initialize-experiment-results-directory.handler';
import { AppendExperimentResultDataHandler } from './handlers/append-experiment-result-data.handler';
import { FillInitialIoDataHandler } from './handlers/fill-initial-io-data.handler';
import { SendExperimentResultCreatedToClientHandler } from './handlers/to-client/send-experiment-result-created-to-client.handler';

export const CommandHandlers = [
  ExperimentResultInsertHandler,
  ExperimentResultUpdateHandler,
  ExperimentResultDeleteHandler,
  ExperimentResultInitializeHandler,
  ExperimentResultValidateHandler,
  WriteExperimentResultToFileHandler,
  InitializeExperimentResultsDirectoryHandler,
  AppendExperimentResultDataHandler,
  FillInitialIoDataHandler,
  SendExperimentResultCreatedToClientHandler,
];
