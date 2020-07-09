import { ClientConnectedHandler } from './handlers/client-connected.handler';
import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';

export const StimulatorEvents = [
  ClientConnectedHandler,
  StimulatorDataHandler,
  FirmwareUpdatedHandler,
];
