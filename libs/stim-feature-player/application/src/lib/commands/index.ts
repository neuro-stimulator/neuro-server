import { PrepareExperimentPlayerHandler } from './handlers/prepare-experiment-player.handler';
import { ExperimentResultInitializeHandler } from './handlers/experiment-result-initialize.handler';
import { FillInitialIoDataHandler } from './handlers/fill-initial-io-data.handler';
import { AppendExperimentResultDataHandler } from './handlers/append-experiment-result-data.handler';
import { ExperimentResultClearHandler } from './handlers/experiment-result-clear.handler';
import { ProcessStimulatorIoDataHandler } from './handlers/process-stimulator-io-data.handler';
import { SendStimulatorIoDataToClientHandler } from './handlers/to-client/send-stimulator-io-data-to-client.handler';

export const CommandHandlers = [
  PrepareExperimentPlayerHandler,
  ExperimentResultInitializeHandler,
  AppendExperimentResultDataHandler,
  FillInitialIoDataHandler,
  ExperimentResultClearHandler,
  ProcessStimulatorIoDataHandler,
  SendStimulatorIoDataToClientHandler,
];
