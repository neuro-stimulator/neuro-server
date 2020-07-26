import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PrepareExperimentPlayerCommand } from '@diplomka-backend/stim-feature-player/application';

@Injectable()
export class PlayerFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async prepare(experimentID: number, options) {
    return this.commandBus.execute(new PrepareExperimentPlayerCommand(experimentID, options));
  }
}
