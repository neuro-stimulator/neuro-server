import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ExperimentResultsController } from './controller/experiment-results.controller';
import { ExperimentResultsFacade } from './service/experiment-results.facade';

@Module({
  imports: [CqrsModule],
  controllers: [ExperimentResultsController],
  providers: [ExperimentResultsFacade],
  exports: [ExperimentResultsFacade],
})
export class StimFeatureExperimentResultsInfrastructureModule {}
