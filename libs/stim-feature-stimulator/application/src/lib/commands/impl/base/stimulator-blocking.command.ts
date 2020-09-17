import { StimulatorCommandType } from '@diplomka-backend/stim-feature-stimulator/domain';

export interface StimulatorBlockingCommand {
  waitForResponse: boolean;
  commandType: StimulatorCommandType;
}
