import { IEvent } from '@nestjs/cqrs';

import { StimulatorCommandType } from '@diplomka-backend/stim-feature-stimulator/domain';

export class StimulatorBlockingCommandFailedEvent implements IEvent {
  constructor(public readonly command: StimulatorCommandType) {}
}
