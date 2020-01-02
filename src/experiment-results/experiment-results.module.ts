import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { ExperimentResultsController } from './experiment-results.controller';
import { ExperimentResultsService } from './experiment-results.service';
import { ExperimentResultEntity } from './experiment-result.entity';
import { ExperimentResultGateway } from './experiment-result.gateway';

@Module({
  controllers: [
    ExperimentResultsController
  ],
  providers: [
    ExperimentResultsService,
    ExperimentResultGateway
  ],
  imports: [
    TypeOrmModule.forFeature([
      ExperimentResultEntity
    ]),
    InMemoryDBModule.forFeature('IoEventInmemoryEntity'),
    LowLevelModule,
    ExperimentsModule
  ]
})
export class ExperimentResultsModule {

}

