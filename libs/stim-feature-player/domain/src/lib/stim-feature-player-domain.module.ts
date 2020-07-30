import { Module } from '@nestjs/common';

import { ExperimentStopConditionFactory } from './experiment-stop-condition/experiment-stop-condition.factory';

@Module({
  controllers: [],
  providers: [ExperimentStopConditionFactory],
  exports: [ExperimentStopConditionFactory],
})
export class StimFeaturePlayerDomainModule {}
