import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ExperimentResult, ExperimentStopConditionType, ExperimentType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { PlayerConfigurationQuery, PrepareExperimentPlayerCommand, StopConditionTypesQuery } from '@neuro-server/stim-feature-player/application';

@Injectable()
export class PlayerFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async prepare(experimentID: number, playerConfiguration: PlayerConfiguration, userID: number, userGroups: number[]): Promise<ExperimentResult> {
    return this.commandBus.execute(new PrepareExperimentPlayerCommand(experimentID, playerConfiguration, userID, userGroups));
  }

  public async getPlayerState(): Promise<PlayerConfiguration> {
    return this.queryBus.execute(new PlayerConfigurationQuery());
  }

  public async getStopConditions(experimentType: ExperimentType): Promise<ExperimentStopConditionType[]> {
    return this.queryBus.execute(new StopConditionTypesQuery(experimentType));
  }
}
