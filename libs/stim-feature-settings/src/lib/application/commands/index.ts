import { LoadSettingsHandler } from './handlers/load-settings.handler';
import { UpdateSettingsHandler } from './handlers/update-settings.handler';

export const CommandHandlers = [LoadSettingsHandler, UpdateSettingsHandler];

export * from './impl/load-settings.command';
export * from './impl/update-settings.command';
