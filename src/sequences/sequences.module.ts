import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentsModule } from '../experiments/experiments.module';
import { SequencesService } from './sequences.service';
import { SequencesController } from './sequences-controller';
import { SequencesGateway } from './sequences-gateway';
import { SequenceEntity } from './entity/sequence.entity';
import { SequenceRepository } from './repository/sequence.repository';

@Module({
  controllers: [
    SequencesController
  ],
  providers: [
    SequencesService,
    SequencesGateway,

    SequenceRepository
  ],
  imports: [
    TypeOrmModule.forFeature([
      SequenceEntity
    ]),
    ExperimentsModule
  ],
  exports: [
    SequencesService
  ],
})
export class SequencesModule {

}
