import { Module } from '@nestjs/common';
import { ExperimentResultsController } from './experiment-results.controller';
import { ExperimentResultsService } from './experiment-results.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentResultEntity } from './experiment-result.entity';

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
    ])
  ]
})
export class ExperimentResultsModule {

}

