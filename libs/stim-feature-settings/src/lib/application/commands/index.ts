import { LoadSettingsHandler } from './handlers/load-settings.handler';
import { UpdateSettingsHandler } from './handlers/update-settings.handler';

export const CommandHandlers = [LoadSettingsHandler, UpdateSettingsHandler];

export * from './handlers/load-settings.handler';
export * from './handlers/update-settings.handler';

export * from './impl/load-settings.command';
