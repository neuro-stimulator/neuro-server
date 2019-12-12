import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentEntity } from './experiment.entity';
import { ExperimentsGateway } from './experiments.gateway';
import { ExperimentErpEntity } from './type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './type/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './type/experiment-erp-output-dependency.entity';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentCvepEntity } from './type/experiment-cvep.entity';
import { ExperimentFvepEntity } from './type/experiment-fvep.entity';
import { ExperimentTvepEntity } from './type/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from './type/experiment-tvep-output.entity';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExperimentEntity,
      ExperimentErpEntity, ExperimentErpOutputEntity,
      ExperimentErpOutputDependencyEntity,
      ExperimentCvepEntity,
      ExperimentFvepEntity,
      ExperimentTvepEntity,
      ExperimentTvepOutputEntity
    ]),
    InMemoryDBModule.forFeature('IoEventInmemoryEntity'),
    LowLevelModule
  ],
  exports: [
    TypeOrmModule,
    ExperimentsService
  ],
  providers: [
    ExperimentsService,
    ExperimentsGateway,
  ],
  controllers: [
    ExperimentsController,
  ],
})
export class ExperimentsModule {

}
