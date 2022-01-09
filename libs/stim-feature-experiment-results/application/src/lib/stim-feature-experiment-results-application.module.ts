import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';
import { StimFeatureExperimentResultsDomainModule } from '@neuro-server/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from './services/experiment-results.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { Sagas } from './sagas';

@Module({
  imports: [CqrsModule, StimLibSocketModule, StimFeatureExperimentResultsDomainModule],
  providers: [ExperimentResultsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, ...Sagas],
  exports: [],
})
export class StimFeatureExperimentResultsApplicationModule {}
