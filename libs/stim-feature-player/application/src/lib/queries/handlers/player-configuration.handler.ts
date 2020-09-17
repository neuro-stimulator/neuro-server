import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { PlayerService } from '../../service/player.service';
import { PlayerConfigurationQuery } from '../impl/player-configuration.query';

@QueryHandler(PlayerConfigurationQuery)
export class PlayerConfigurationHandler implements IQueryHandler<PlayerConfigurationQuery, PlayerConfiguration> {
  private readonly logger: Logger = new Logger(PlayerConfigurationHandler.name);

  constructor(private readonly service: PlayerService) {}

  async execute(query: PlayerConfigurationQuery): Promise<PlayerConfiguration> {
    return this.service.playerConfiguration;
  }
}
