import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeederServiceProvider, StimFeatureSeedApplicationModule } from '@diplomka-backend/stim-feature-seed/application';
import { ExperimentStopConditionFactory } from './experiment-stop-condition/experiment-stop-condition.factory';
import { ExperimentStopConditionEntity } from './model/entity/experiment-stop-condition.entity';
import { ExperimentStopConditionSeeder } from './repository/experiment-stop-condition.seeder';
import { REPOSITORIES, SEEDERS } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentStopConditionEntity]), StimFeatureSeedApplicationModule],
  providers: [ExperimentStopConditionFactory, ...REPOSITORIES, ...SEEDERS],
  exports: [ExperimentStopConditionFactory, ...REPOSITORIES],
})
export class StimFeaturePlayerDomainModule implements OnModuleInit {
  constructor(private readonly seedProvider: SeederServiceProvider, private readonly seeder: ExperimentStopConditionSeeder) {}

  public onModuleInit(): void {
    this.seedProvider.registerSeeder(this.seeder, ExperimentStopConditionEntity);
  }
}
