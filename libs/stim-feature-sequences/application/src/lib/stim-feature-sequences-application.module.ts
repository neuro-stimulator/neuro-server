import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSequencesDomainModule } from '@neuro-server/stim-feature-sequences/domain';

import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { QueryHandlers } from './queries';
import { SequencesService } from './services/sequences.service';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureSequencesDomainModule],
  providers: [SequencesService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
  exports: [],
})
export class StimFeatureSequencesApplicationModule {}
