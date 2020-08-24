import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SequenceEntity } from './model/entity/sequence.entity';
import { REPOSITORIES } from './repository/index';
import { SequenceGeneratorFactory } from './generator/sequence-generator.factory';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceEntity])],
  providers: [...REPOSITORIES, SequenceGeneratorFactory],
  exports: [...REPOSITORIES],
})
export class StimFeatureSequencesDomainModule {}
