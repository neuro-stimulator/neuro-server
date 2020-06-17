// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
//
// import { LowLevelModule } from '../low-level/low-level.module';
// import { ExperimentsModule } from '../experiments/experiments.module';
// import { ExperimentResultsController } from 'libs/stim-feature-experiment-results/src/lib/infrastructure/controller/experiment-results.controller';
// import { ExperimentResultsService } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service';
// import { ExperimentResultEntity } from 'libs/stim-feature-experiment-results/src/lib/domain/model/entity/experiment-result.entity';
// import { ExperimentResultsGateway } from './experiment-results.gateway';
// import { FileBrowserModule } from '../file-browser/file-browser.module';

// @Module({
//   controllers: [ExperimentResultsController],
//   providers: [ExperimentResultsService, ExperimentResultsGateway],
//   imports: [
//     TypeOrmModule.forFeature([ExperimentResultEntity]),
//     LowLevelModule,
//     ExperimentsModule,
//     FileBrowserModule,
//   ],
//   exports: [ExperimentResultsService],
// })
export class ExperimentResultsModule {}
