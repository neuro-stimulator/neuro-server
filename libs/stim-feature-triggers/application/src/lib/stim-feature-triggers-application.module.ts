import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureTriggersDomainModule } from '@neuro-server/stim-feature-triggers/domain';
import { StimFeatureFileBrowserModule } from '@neuro-server/stim-feature-file-browser';

import { TriggersService } from './service/triggers.service';
import { QueryHandlers } from './query';
import { CommandHandlers } from './command';
import { EventHandlers } from './event';
import { Sagas } from './saga';

@Module({
  imports: [CqrsModule, StimFeatureTriggersDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [TriggersService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, ...Sagas],
})
export class StimFeatureTriggersApplicationModule {}
