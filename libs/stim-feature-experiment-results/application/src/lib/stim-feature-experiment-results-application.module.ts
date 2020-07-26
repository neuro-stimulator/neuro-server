import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentResultsDomainModule } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from './services/experiment-results.service';
import { QueryHandlers } from './queries/index';
import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';
import { Sagas } from './sagas/index';

@Module({
  imports: [CqrsModule, StimLibSocketModule, StimFeatureFileBrowserModule.forFeature(), StimFeatureExperimentResultsDomainModule],
  providers: [ExperimentResultsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers, ...Sagas],
  exports: [],
})
export class StimFeatureExperimentResultsApplicationModule {}
