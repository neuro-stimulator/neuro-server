import { IEvent } from '@nestjs/cqrs';

import { StimulatorData } from '@diplomka-backend/stim-feature-stimulator/domain';

export class StimulatorEvent implements IEvent {
  constructor(public readonly commandID: number, public readonly data: StimulatorData) {}
}
