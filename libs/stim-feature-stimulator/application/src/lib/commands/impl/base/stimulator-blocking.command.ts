import { StimulatorCommandType } from '@neuro-server/stim-feature-stimulator/domain';

export interface StimulatorBlockingCommand {
  waitForResponse: boolean;
  commandType: StimulatorCommandType;
}
