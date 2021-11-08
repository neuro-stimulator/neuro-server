import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureTriggersApplicationModule } from '@neuro-server/stim-feature-triggers/application';

import { StimFeatureTriggersFacade } from './service/stim-feature-triggers.facade';
import { StimFeatureTriggersController } from './controller/stim-feature-triggers.controller';

@Module({
  controllers: [StimFeatureTriggersController],
  imports: [CqrsModule, StimFeatureTriggersApplicationModule],
  providers: [StimFeatureTriggersFacade],
  exports: [StimFeatureTriggersFacade],
})
export class StimFeatureTriggersInfrastructureModule {}
