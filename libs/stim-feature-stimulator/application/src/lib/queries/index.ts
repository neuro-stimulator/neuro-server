import { DiscoverHandler } from './handlers/discover.handler';
import { GetCurrentExperimentIdHandler } from './handlers/get-current-experiment-id.handler';
import { GetStimulatorConnectionStatusHandler } from './handlers/get-stimulator-connection-status.handler';
import { LastKnowStimulatorStateHandler } from './handlers/last-know-stimulator-state.handler';
import { ParseStimulatorDataHandler } from './handlers/parse-stimulator-data.handler';

export const StimulatorQueries = [GetStimulatorConnectionStatusHandler, DiscoverHandler, ParseStimulatorDataHandler, GetCurrentExperimentIdHandler, LastKnowStimulatorStateHandler];
