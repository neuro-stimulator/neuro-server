import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';
import { StimFeaturePlayerDomainModule } from '@neuro-server/stim-feature-player/domain';
import { StimFeatureIpcApplicationModule } from '@neuro-server/stim-feature-ipc/application';

import { PlayerService } from './service/player.service';
import { StopConditionsService } from './service/stop-conditions.service';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { QueryHandlers } from './queries';
import { Sagas } from './saga';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeaturePlayerDomainModule, StimLibSocketModule, StimFeatureIpcApplicationModule.forFeature()],
  providers: [PlayerService, StopConditionsService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers, ...Sagas],
  exports: [],
})
export class StimFeaturePlayerApplicationModule {}
