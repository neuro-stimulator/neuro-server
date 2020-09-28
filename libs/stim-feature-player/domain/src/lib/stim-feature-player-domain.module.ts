import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentStopConditionFactory } from './experiment-stop-condition/experiment-stop-condition.factory';
import { ExperimentStopConditionEntity } from './model/entity/experiment-stop-condition.entity';
import { REPOSITORIES } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentStopConditionEntity])],
  providers: [ExperimentStopConditionFactory, ...REPOSITORIES],
  exports: [ExperimentStopConditionFactory, ...REPOSITORIES],
})
export class StimFeaturePlayerDomainModule {}
