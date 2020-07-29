import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PrepareExperimentPlayerCommand } from '@diplomka-backend/stim-feature-player/application';
import { ExperimentEndConditionParams, ExperimentEndConditionType, PlayerConfigurationDTO } from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class PlayerFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async prepare(experimentID: number, conditionType: ExperimentEndConditionType, playerConfiguration: PlayerConfigurationDTO) {
    return this.commandBus.execute(new PrepareExperimentPlayerCommand(experimentID, conditionType, playerConfiguration));
  }
}
