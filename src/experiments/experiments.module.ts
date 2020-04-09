import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentEntity } from './entity/experiment.entity';
import { ExperimentsGateway } from './experiments.gateway';
import { ExperimentErpEntity } from './entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './entity/experiment-erp-output-dependency.entity';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentCvepEntity } from './entity/experiment-cvep.entity';
import { ExperimentFvepEntity } from './entity/experiment-fvep.entity';
import { ExperimentTvepEntity } from './entity/experiment-tvep.entity';
import { ExperimentReaEntity } from './entity/experiment-rea.entity';
import { ExperimentTvepOutputEntity } from './entity/experiment-tvep-output.entity';
import { ExperimentFvepOutputEntity } from './entity/experiment-fvep-output.entity';
import { ExperimentRepository } from './repository/experiment.repository';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { ExperimentReaRepository } from './repository/experiment-rea.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExperimentEntity,
      ExperimentErpEntity, ExperimentErpOutputEntity,
      ExperimentErpOutputDependencyEntity,
      ExperimentCvepEntity,
      ExperimentFvepEntity,
      ExperimentFvepOutputEntity,
      ExperimentTvepEntity,
      ExperimentTvepOutputEntity,
      ExperimentReaEntity
    ]),
    LowLevelModule
  ],
  exports: [
    TypeOrmModule,
    ExperimentsService
  ],
  providers: [
    ExperimentsService,
    ExperimentsGateway,

    ExperimentRepository,
    ExperimentErpRepository,
    ExperimentCvepRepository,
    ExperimentFvepRepository,
    ExperimentTvepRepository,
    ExperimentReaRepository
  ],
  controllers: [
    ExperimentsController,
  ],
})
export class ExperimentsModule {

}
