import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSequencesApplicationModule } from '@neuro-server/stim-feature-sequences/application';

import { SequencesFacade } from './service/sequences.facade';
import { SequencesController } from './controller/sequences.controller';

@Module({
  controllers: [SequencesController],
  imports: [CqrsModule, StimFeatureSequencesApplicationModule],
  providers: [SequencesFacade],
  exports: [SequencesFacade],
})
export class StimFeatureSequencesInfrastructureModule {}
