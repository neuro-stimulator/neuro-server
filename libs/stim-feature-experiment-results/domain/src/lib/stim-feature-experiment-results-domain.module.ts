import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentResultEntity } from './model/entity/experiment-result.entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([ExperimentResultEntity])],
  providers: [...REPOSITORIES, ...SEEDERS],
  exports: [],
})
export class StimFeatureExperimentResultsDomainModule {}
