import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureTriggersDomainModule } from '@neuro-server/stim-feature-triggers/domain';

import { CommandHandlers } from './command';
import { EventHandlers } from './event';
import { QueryHandlers } from './query';
import { Sagas } from './saga';
import { TriggersService } from './service/triggers.service';

@Module({
  imports: [CqrsModule, StimFeatureTriggersDomainModule],
  providers: [TriggersService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, ...Sagas],
})
export class StimFeatureTriggersApplicationModule {}
