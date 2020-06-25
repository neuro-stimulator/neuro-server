import { ExperimentResultInsertHandler } from './handlers/experiment-result-insert.handler';
import { ExperimentResultUpdateHandler } from './handlers/experiment-result-update.handler';
import { ExperimentResultDeleteHandler } from './handlers/experiment-result-delete.handler';
import { ExpeirmentResultInitializeHandler } from './handlers/expeirment-result-initialize.handler';
import { ExperimentResultValidateHandler } from './handlers/experiment-result-validate.handler';
import { WriteExperimentResultToFileHandler } from './handlers/write-experiment-result-to-file.handler';
import { InitializeExperimentResultsDirectoryHandler } from './handlers/initialize-experiment-results-directory.handler';
import { AppendExperimentResultDataHandler } from './handlers/append-experiment-result-data.handler';
import { FillInitialIoDataHandler } from './handlers/fill-initial-io-data.handler';

export const CommandHandlers = [
  ExperimentResultInsertHandler,
  ExperimentResultUpdateHandler,
  ExperimentResultDeleteHandler,
  ExpeirmentResultInitializeHandler,
  ExperimentResultValidateHandler,
  WriteExperimentResultToFileHandler,
  InitializeExperimentResultsDirectoryHandler,
  AppendExperimentResultDataHandler,
  FillInitialIoDataHandler,
];
