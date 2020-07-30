import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { PrepareExperimentPlayerCommand } from '@diplomka-backend/stim-feature-player/application';

@Injectable()
export class PlayerFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async prepare(experimentID: number, playerConfiguration: PlayerConfiguration) {
    return this.commandBus.execute(new PrepareExperimentPlayerCommand(experimentID, playerConfiguration));
  }
}
