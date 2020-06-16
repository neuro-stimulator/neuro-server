import { OpenHandler } from './handlers/open.handler';
import { CloseHandler } from './handlers/close.handler';
import { FirmwareUpdateHandler } from './handlers/firmware-update.handler';

export const SerialHandlers = [
  OpenHandler,
  CloseHandler,
  FirmwareUpdateHandler,
];

export * from './handlers/open.handler';
export * from './handlers/close.handler';
export * from './handlers/firmware-update.handler';

export * from './impl/open.command';
export * from './impl/close.command';
export * from './impl/firmware-update.command';
