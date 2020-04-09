import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { ExperimentResultsController } from './experiment-results.controller';
import { ExperimentResultsService } from './experiment-results.service';
import { ExperimentResultEntity } from './entity/experiment-result.entity';
import { ExperimentResultsGateway } from './experiment-results.gateway';

@Module({
  controllers: [
    ExperimentResultsController
  ],
  providers: [
    ExperimentResultsService,
    ExperimentResultsGateway
  ],
  imports: [
    TypeOrmModule.forFeature([
      ExperimentResultEntity
    ]),
    LowLevelModule,
    ExperimentsModule
  ],
  exports: [
    ExperimentResultsService
  ]
})
export class ExperimentResultsModule {

}

