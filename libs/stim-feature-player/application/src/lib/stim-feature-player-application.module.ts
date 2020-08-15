import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeaturePlayerDomainModule } from '@diplomka-backend/stim-feature-player/domain';
import { StimFeatureIpcModule } from '@diplomka-backend/stim-feature-ipc';

import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';
import { QueryHandlers } from './queries/index';
import { PlayerService } from './service/player.service';
import { Sagas } from './saga/index';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeaturePlayerDomainModule, StimLibSocketModule, StimFeatureIpcModule],
  providers: [PlayerService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers, ...Sagas],
  exports: [],
})
export class StimFeaturePlayerApplicationModule {}
