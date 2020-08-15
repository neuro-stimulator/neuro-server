import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';
import { SettingsLoadedHandler } from './handlers/settings-loaded.handler';

export const StimulatorEvents = [StimulatorDataHandler, FirmwareUpdatedHandler, SettingsLoadedHandler];
