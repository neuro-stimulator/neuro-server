import { BaseBlockingEvent } from '@diplomka-backend/stim-lib-common';
import { StimulatorData } from '@diplomka-backend/stim-feature-stimulator/domain';

export class StimulatorEvent implements BaseBlockingEvent<StimulatorData> {
  constructor(public readonly commandID: number, public readonly data: StimulatorData) {}
}
