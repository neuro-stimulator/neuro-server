import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSequencesModule } from '@diplomka-backend/stim-feature-sequences';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentsService } from './domain/services/experiments.service';
import { ExperimentsController } from './infrastructure/controller/experiments.controller';
import { ExperimentsFacade } from './infrastructure/service/experiments.facade';
import { ENTITIES } from './domain/model/entity';
import { REPOSITORIES } from './domain/repository';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';

@Module({
  controllers: [ExperimentsController],
  imports: [
    TypeOrmModule.forFeature(ENTITIES),
    CqrsModule,
    StimFeatureSequencesModule,
    StimFeatureFileBrowserModule.forFeature(),
  ],
  providers: [
    ExperimentsService,
    ExperimentsFacade,

    ...REPOSITORIES,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
  exports: [ExperimentsFacade],
})
export class StimFeatureExperimentsModule {}
