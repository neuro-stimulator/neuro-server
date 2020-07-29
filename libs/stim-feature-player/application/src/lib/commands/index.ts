import { PrepareExperimentPlayerHandler } from './handlers/prepare-experiment-player.handler';
import { ExperimentResultInitializeHandler } from './handlers/experiment-result-initialize.handler';
import { FillInitialIoDataHandler } from './handlers/fill-initial-io-data.handler';
import { AppendExperimentResultDataHandler } from './handlers/append-experiment-result-data.handler';
import { ExperimentResultClearHandler } from './handlers/experiment-result-clear.handler';
import { ProcessStimulatorIoDataHandler } from './handlers/process-stimulator-io-data.handler';
import { SendStimulatorIoDataToClientHandler } from './handlers/to-client/send-stimulator-io-data-to-client.handler';
import { CreateNewExperimentRoundToClientHandler } from './handlers/to-client/create-new-experiment-round-to-client.handler';
import { StartNewExperimentRoundHandler } from './handlers/start-new-experiment-round.handler';
import { PrepareNextExperimentRoundHandler } from './handlers/prepare-next-experiment-round.handler';

export const CommandHandlers = [
  AppendExperimentResultDataHandler,
  ExperimentResultClearHandler,
  ExperimentResultInitializeHandler,
  FillInitialIoDataHandler,
  PrepareExperimentPlayerHandler,
  ProcessStimulatorIoDataHandler,
  StartNewExperimentRoundHandler,
  PrepareNextExperimentRoundHandler,

  SendStimulatorIoDataToClientHandler,
  CreateNewExperimentRoundToClientHandler,
];
