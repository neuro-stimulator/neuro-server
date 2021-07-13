import { ICommand } from '@nestjs/cqrs';

import { StimulatorNextSequencePartData } from '@diplomka-backend/stim-feature-stimulator/domain';

export class ProcessStimulatorNextSequencePartRequestCommand implements ICommand {

  public readonly offset: number;
  public readonly index: number;

  constructor(readonly data: StimulatorNextSequencePartData) {
    this.offset = data.offset
    this.index = data.index;
  }
}
