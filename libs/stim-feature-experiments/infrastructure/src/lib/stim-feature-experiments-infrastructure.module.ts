import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureExperimentsApplicationModule } from '@neuro-server/stim-feature-experiments/application';

import { INTERCEPTORS } from './interceptor';
import { ExperimentsFacade } from './service/experiments.facade';
import { ExperimentsController } from './controller/experiments.controller';

@Module({
  controllers: [ExperimentsController],
  imports: [CqrsModule, StimFeatureExperimentsApplicationModule],
  providers: [
    ...INTERCEPTORS,
    ExperimentsFacade
  ],
  exports: [ExperimentsFacade],
})
export class StimFeatureExperimentsInfrastructureModule {}
