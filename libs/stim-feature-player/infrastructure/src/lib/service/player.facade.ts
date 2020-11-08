import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { PlayerConfigurationQuery, PrepareExperimentPlayerCommand, StopConditionTypesQuery } from '@diplomka-backend/stim-feature-player/application';

@Injectable()
export class PlayerFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async prepare(experimentID: number, playerConfiguration: PlayerConfiguration, userID: number): Promise<void> {
    return this.commandBus.execute(new PrepareExperimentPlayerCommand(experimentID, playerConfiguration, userID));
  }

  public async getPlayerState(): Promise<PlayerConfiguration> {
    return this.queryBus.execute(new PlayerConfigurationQuery());
  }

  public async getStopConditions(experimentType: ExperimentType) {
    return this.queryBus.execute(new StopConditionTypesQuery(experimentType));
  }
}
