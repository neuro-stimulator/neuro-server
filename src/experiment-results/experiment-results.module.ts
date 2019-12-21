import { Module } from '@nestjs/common';
import { ExperimentResultsController } from './experiment-results.controller';
import { ExperimentResultsService } from './experiment-results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentResultEntity } from './experiment-result.entity';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';

@Module({
  controllers: [
    ExperimentResultsController
  ],
  providers: [
    ExperimentResultsService
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

