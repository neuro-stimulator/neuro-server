import { StimulatorDataHandler } from './handlers/stimulator-data.handler';
import { FirmwareUpdatedHandler } from './handlers/firmware-updated.handler';
import { StimulatorSettingsLoadedHandler } from './handlers/stimulator-settings-loaded.handler';
import { StimulatorBlockingCommandFailedHandler } from './handlers/stimulator-blocking-command-failed.handler';
import { SerialOpenHandler } from './handlers/serial-open.handler';

export const StimulatorEvents = [StimulatorDataHandler, FirmwareUpdatedHandler, StimulatorSettingsLoadedHandler, StimulatorBlockingCommandFailedHandler, SerialOpenHandler];
