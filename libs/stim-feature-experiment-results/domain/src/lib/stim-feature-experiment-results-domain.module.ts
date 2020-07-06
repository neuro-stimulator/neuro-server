import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentResultEntity } from './model/entity/experiment-result.entity';
import { REPOSITORIES } from './repository';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([ExperimentResultEntity])],
  providers: [...REPOSITORIES],
  exports: [],
})
export class StimFeatureExperimentResultsDomainModule {}
