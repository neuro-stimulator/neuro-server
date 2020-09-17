import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';
import { SettingsLoadedHandler } from './handlers/settings-loaded.handler';
import { StimulatorBlockingCommandFailedHandler } from './handlers/stimulator-blocking-command-failed.handler';
import { SerialOpenHandler } from './handlers/serial-open.handler';

export const StimulatorEvents = [StimulatorDataHandler, FirmwareUpdatedHandler, SettingsLoadedHandler, StimulatorBlockingCommandFailedHandler, SerialOpenHandler];
