import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StimFeatureSeedApplicationModule } from '@diplomka-backend/stim-feature-seed/application';

import { ExperimentStopConditionFactory } from './experiment-stop-condition/experiment-stop-condition.factory';
import { ExperimentStopConditionEntity } from './model/entity/experiment-stop-condition.entity';
import { REPOSITORIES } from './repository';
import { SEEDERS } from './seeder';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentStopConditionEntity]), StimFeatureSeedApplicationModule],
  providers: [ExperimentStopConditionFactory, ...REPOSITORIES, ...SEEDERS],
  exports: [ExperimentStopConditionFactory, ...REPOSITORIES],
})
export class StimFeaturePlayerDomainModule {}
