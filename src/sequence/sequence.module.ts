import { Module } from '@nestjs/common';

import { SequenceService } from './sequence.service';
import { SequenceController } from './sequence.controller';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SequenceGateway } from './sequence.gateway';

@Module({
  controllers: [
    SequenceController
  ],
  imports: [
    ExperimentsModule
  ],
  exports: [
    SequenceService
  ],
  providers: [
    SequenceService,
    SequenceGateway
  ],
})
export class SequenceModule {

}
