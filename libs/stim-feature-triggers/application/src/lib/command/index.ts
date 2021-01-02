import { DisableTriggersHandler } from './handlers/disable-triggers.handler';
import { EnableTriggersHandler } from './handlers/enable-triggers.handler';
import { InitializeTriggersHandler } from './handlers/initialize-triggers.handler';

export const CommandHandlers = [DisableTriggersHandler, EnableTriggersHandler, InitializeTriggersHandler];
