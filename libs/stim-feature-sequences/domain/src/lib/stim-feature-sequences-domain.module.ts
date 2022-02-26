import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SequenceGeneratorFactory } from './generator/sequence-generator.factory';
import { SequenceEntity } from './model/entity/sequence.entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';

@Module({
  imports: [TypeOrmModule.forFeature([SequenceEntity])],
  providers: [...REPOSITORIES, ...SEEDERS, SequenceGeneratorFactory],
  exports: [...REPOSITORIES, SequenceGeneratorFactory],
})
export class StimFeatureSequencesDomainModule {}
