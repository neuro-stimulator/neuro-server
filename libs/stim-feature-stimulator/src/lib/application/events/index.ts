import { ClientConnectedHandler } from './handlers/client-connected.handler';
import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';

export const StimulatorEvents = [
  ClientConnectedHandler,
  StimulatorDataHandler,
  FirmwareUpdatedHandler,
];

export * from './impl/serial-open.event';
export * from './impl/serial-closed.event';
export * from './impl/firmware-updated.event';
export * from './impl/stimulator-data.event';
export * from './impl/stimulator.event';
export * from './impl/firmware-updated.event';
