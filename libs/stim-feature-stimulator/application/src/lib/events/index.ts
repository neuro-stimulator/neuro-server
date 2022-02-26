import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';
import { SerialOpenHandler } from './handlers/serial-open.handler';
import { StimulatorBlockingCommandFailedHandler } from './handlers/stimulator-blocking-command-failed.handler';
import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { StimulatorSettingsLoadedHandler } from './handlers/stimulator-settings-loaded.handler';

export const StimulatorEvents = [StimulatorDataHandler, FirmwareUpdatedHandler, StimulatorSettingsLoadedHandler, StimulatorBlockingCommandFailedHandler, SerialOpenHandler];
