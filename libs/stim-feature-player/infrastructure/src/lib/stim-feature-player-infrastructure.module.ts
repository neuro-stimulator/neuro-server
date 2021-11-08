import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeaturePlayerApplicationModule } from '@neuro-server/stim-feature-player/application';

import { PlayerController } from './controller/player.controller';
import { PlayerFacade } from './service/player.facade';

@Module({
  controllers: [PlayerController],
  imports: [CqrsModule, StimFeaturePlayerApplicationModule],
  providers: [PlayerFacade],
  exports: [],
})
export class StimFeaturePlayerInfrastructureModule {}
