import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentEntity } from './experiment.entity';
import { ExperimentsGateway } from './experiments.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentEntity]),
  ],
  exports: [
    TypeOrmModule,
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
