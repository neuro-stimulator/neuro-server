import { StimulatorData } from '@neuro-server/stim-feature-stimulator/domain';
import { BaseBlockingEvent } from '@neuro-server/stim-lib-common';

export class StimulatorEvent implements BaseBlockingEvent<StimulatorData> {
  constructor(public readonly commandID: number, public readonly data: StimulatorData) {}
}
