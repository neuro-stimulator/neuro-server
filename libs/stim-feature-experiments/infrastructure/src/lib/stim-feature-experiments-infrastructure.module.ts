import { Module } from '@nestjs/common';

import { ExperimentsFacade } from './service/experiments.facade';
import { ExperimentsController } from './controller/experiments.controller';

@Module({
  controllers: [ExperimentsController],
  providers: [ExperimentsFacade],
  exports: [],
})
export class StimFeatureExperimentsInfrastructureModule {}
