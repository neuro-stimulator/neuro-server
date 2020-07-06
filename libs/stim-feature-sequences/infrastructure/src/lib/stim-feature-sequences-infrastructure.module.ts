import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SequencesFacade } from './service/sequences.facade';
import { SequencesController } from './controller/sequences-controller';

@Module({
  controllers: [SequencesController],
  imports: [CqrsModule],
  providers: [SequencesFacade],
  exports: [SequencesFacade],
})
export class StimFeatureSequencesInfrastructureModule {}
