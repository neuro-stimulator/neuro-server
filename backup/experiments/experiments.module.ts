// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
//
// import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/infrastructure/experiments.service';
// import { ExperimentsController } from 'libs/stim-feature-experiments/src/lib/experiments.controller';
// import { ExperimentEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment.entity';
// import { ExperimentsGateway } from './experiments.gateway';
// import { ExperimentErpEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-erp.entity';
// import { ExperimentErpOutputEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-erp-output.entity';
// import { ExperimentErpOutputDependencyEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-erp-output-dependency.entity';
// import { LowLevelModule } from '../low-level/low-level.module';
// import { ExperimentCvepEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-cvep.entity';
// import { ExperimentFvepEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-fvep.entity';
// import { ExperimentTvepEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-tvep.entity';
// import { ExperimentReaEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-rea.entity';
// import { ExperimentTvepOutputEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-tvep-output.entity';
// import { ExperimentFvepOutputEntity } from '../../../../../libs/stim-feature-experiments/src/lib/entity/experiment-fvep-output.entity';
// import { ExperimentRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment.repository';
// import { ExperimentErpRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment-erp.repository';
// import { ExperimentCvepRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment-cvep.repository';
// import { ExperimentFvepRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment-fvep.repository';
// import { ExperimentTvepRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment-tvep.repository';
// import { ExperimentReaRepository } from '../../../../../libs/stim-feature-experiments/src/lib/repository/experiment-rea.repository';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       ExperimentEntity,
//       ExperimentErpEntity,
//       ExperimentErpOutputEntity,
//       ExperimentErpOutputDependencyEntity,
//       ExperimentCvepEntity,
//       ExperimentFvepEntity,
//       ExperimentFvepOutputEntity,
//       ExperimentTvepEntity,
//       ExperimentTvepOutputEntity,
//       ExperimentReaEntity,
//     ]),
//     LowLevelModule,
//   ],
//   exports: [TypeOrmModule, ExperimentsService],
//   providers: [
//     ExperimentsService,
//     ExperimentsGateway,
//
//     ExperimentRepository,
//   expressaga  ExperimentErpRepository,
//     ExperimentCvepRepository,
//     ExperimentFvepRepository,
//     ExperimentTvepRepository,
//     ExperimentReaRepository,
//   ],
//   controllers: [ExperimentsController],
// })
export class ExperimentsModule {}
