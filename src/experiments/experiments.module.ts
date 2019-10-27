import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentsService } from './experiments.service';
import { ExperimentsController } from './experiments.controller';
import { ExperimentEntity } from './experiment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentEntity]),
  ],
  exports: [
    TypeOrmModule,
  ],
  providers: [
    ExperimentsService,
  ],
  controllers: [
    ExperimentsController,
  ],
})
export class ExperimentsModule {

}
