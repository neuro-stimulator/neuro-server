import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PlayerLocalConfiguration } from '@diplomka-backend/stim-feature-player/domain';

import { PlayerService } from '../../service/player.service';
import { PlayerLocalConfigurationQuery } from '../impl/player-local-configuration.query';

@QueryHandler(PlayerLocalConfigurationQuery)
export class PlayerLocalConfigurationHandler implements IQueryHandler<PlayerLocalConfigurationQuery, PlayerLocalConfiguration> {
  private readonly logger: Logger = new Logger(PlayerLocalConfigurationHandler.name);

  constructor(private readonly service: PlayerService) {}

  async execute(query: PlayerLocalConfigurationQuery): Promise<PlayerLocalConfiguration> {
    return this.service.playerLocalConfiguration;
  }
}
