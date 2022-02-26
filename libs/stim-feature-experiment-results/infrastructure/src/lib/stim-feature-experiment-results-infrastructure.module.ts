import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureExperimentResultsApplicationModule } from '@neuro-server/stim-feature-experiment-results/application';

import { ExperimentResultsController } from './controller/experiment-results.controller';
import { ExperimentResultsFacade } from './service/experiment-results.facade';

@Module({
  imports: [CqrsModule, StimFeatureExperimentResultsApplicationModule],
  controllers: [ExperimentResultsController],
  providers: [ExperimentResultsFacade],
  exports: [ExperimentResultsFacade],
})
export class StimFeatureExperimentResultsInfrastructureModule {}
