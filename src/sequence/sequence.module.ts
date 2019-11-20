import { Module } from '@nestjs/common';

import { SequenceService } from './sequence.service';
import { SequenceController } from './sequence.controller';
import { ExperimentsModule } from '../experiments/experiments.module';

@Module({
  controllers: [
    SequenceController
  ],
  imports: [ExperimentsModule],
  providers: [
    SequenceService
  ],
})
export class SequenceModule {

}
