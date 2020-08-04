import { GetStimulatorConnectionStatusHandler } from './handlers/get-stimulator-connection-status.handler';
import { DiscoverHandler } from './handlers/discover.handler';
import { ParseStimulatorDataHandler } from './handlers/parse-stimulator-data.handler';
import { GetCurrentExperimentIdHandler } from './handlers/get-current-experiment-id.handler';
import { LastKnowStimulatorStateHandler } from './handlers/last-know-stimulator-state.handler';

export const StimulatorQueries = [GetStimulatorConnectionStatusHandler, DiscoverHandler, ParseStimulatorDataHandler, GetCurrentExperimentIdHandler, LastKnowStimulatorStateHandler];
