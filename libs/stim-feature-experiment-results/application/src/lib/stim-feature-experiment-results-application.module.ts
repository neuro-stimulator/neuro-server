import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureExperimentResultsDomainModule } from '@neuro-server/stim-feature-experiment-results/domain';
import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';

import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { QueryHandlers } from './queries';
import { Sagas } from './sagas';
import { ExperimentResultsService } from './services/experiment-results.service';

@Module({
  imports: [CqrsModule, StimLibSocketModule, StimFeatureExperimentResultsDomainModule],
  providers: [ExperimentResultsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, ...Sagas],
  exports: [],
})
export class StimFeatureExperimentResultsApplicationModule {}
