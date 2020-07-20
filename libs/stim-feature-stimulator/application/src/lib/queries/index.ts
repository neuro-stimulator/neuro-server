import { GetStimulatorConnectionStatusHandler } from './handlers/get-stimulator-connection-status.handler';
import { DiscoverHandler } from './handlers/discover.handler';
import { ParseStimulatorDataHandler } from './handlers/parse-stimulator-data.handler';
import { GetCurrentExperimentIdHandler } from './handlers/get-current-experiment-id.handler';

export const StimulatorQueries = [
  GetStimulatorConnectionStatusHandler,
  DiscoverHandler,
  ParseStimulatorDataHandler,
  GetCurrentExperimentIdHandler,
];
