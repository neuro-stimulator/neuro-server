import { GetCurrentSequenceHandler } from './handlers/get-current-sequence.handler';
import { PlayerConfigurationHandler } from './handlers/player-configuration.handler';
import { PlayerLocalConfigurationHandler } from './handlers/player-local-configuration.handler';
import { StopConditionTypesHandler } from './handlers/stop-condition-types.handler';

export const QueryHandlers = [
  PlayerLocalConfigurationHandler,
  PlayerConfigurationHandler,
  StopConditionTypesHandler,
  GetCurrentSequenceHandler
];
