import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentEntity } from './experiment.entity';
import { ExperimentsGateway } from './experiments.gateway';
import { ExperimentErpEntity } from './type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './type/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './type/experiment-erp-output-dependency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExperimentEntity,
      ExperimentErpEntity, ExperimentErpOutputEntity,
      ExperimentErpOutputDependencyEntity,
    ]),
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
