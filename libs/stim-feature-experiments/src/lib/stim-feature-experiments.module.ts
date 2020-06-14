import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { ExperimentsService } from './domain/services/experiments.service';
import { ExperimentsController } from './infrastructure/controller/experiments.controller';
import { ExperimentsFacade } from './infrastructure/service/experiments.facade';
import { ENTITIES } from './domain/model/entity';
import { REPOSITORIES } from './domain/repository';
import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES), CqrsModule],
  exports: [TypeOrmModule, ExperimentsService],
  providers: [
    ExperimentsService,
    ExperimentsFacade,

    ...REPOSITORIES,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
  controllers: [ExperimentsController],
})
export class StimFeatureExperimentsModule {}
