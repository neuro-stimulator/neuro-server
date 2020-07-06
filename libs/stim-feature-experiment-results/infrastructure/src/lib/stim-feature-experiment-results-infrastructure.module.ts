import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ExperimentResultsController } from './controller/experiment-results.controller';
import { ExperimentResultsFacade } from './service/experiment-results.facade';
import { StimFeatureExperimentResultsApplicationModule } from '@diplomka-backend/stim-feature-experiment-results/application';

@Module({
  imports: [CqrsModule, StimFeatureExperimentResultsApplicationModule],
  controllers: [ExperimentResultsController],
  providers: [ExperimentResultsFacade],
  exports: [ExperimentResultsFacade],
})
export class StimFeatureExperimentResultsInfrastructureModule {}
