import { Module } from '@nestjs/common';

import { ExperimentEndConditionFactory } from './experiment-end-condition/experiment-end-condition.factory';

@Module({
  controllers: [],
  providers: [ExperimentEndConditionFactory],
  exports: [ExperimentEndConditionFactory],
})
export class StimFeaturePlayerDomainModule {}
