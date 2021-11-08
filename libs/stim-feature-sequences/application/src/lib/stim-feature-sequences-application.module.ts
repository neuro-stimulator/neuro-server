import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSequencesDomainModule } from '@neuro-server/stim-feature-sequences/domain';
import { StimFeatureFileBrowserModule } from '@neuro-server/stim-feature-file-browser';

import { SequencesService } from './services/sequences.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureSequencesDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [SequencesService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
  exports: [],
})
export class StimFeatureSequencesApplicationModule {}
