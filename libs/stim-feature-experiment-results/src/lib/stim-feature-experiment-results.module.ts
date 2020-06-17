import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureStimulatorModule } from '@diplomka-backend/stim-feature-stimulator';
import { StimFeatureExperimentsModule } from '@diplomka-backend/stim-feature-experiments';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultsService } from './domain/services/experiment-results.service';
import { ExperimentResultEntity } from './domain/model/entity/experiment-result.entity';
import { ExperimentResultsController } from './infrastructure/controller/experiment-results.controller';
import { ExperimentResultsFacade } from './infrastructure/service/experiment-results.facade';
import { REPOSITORIES } from './domain/repository';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';
import { Sagas } from './application/sagas';

@Module({
  controllers: [ExperimentResultsController],
  imports: [
    TypeOrmModule.forFeature([ExperimentResultEntity]),
    CqrsModule,
    StimFeatureStimulatorModule,
    StimFeatureExperimentsModule,
    StimFeatureFileBrowserModule.forFeature(),
  ],
  providers: [
    ExperimentResultsService,
    ExperimentResultsFacade,

    ...REPOSITORIES,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
  ],
  exports: [ExperimentResultsFacade],
})
export class StimFeatureExperimentResultsModule {}
