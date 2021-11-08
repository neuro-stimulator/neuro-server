import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';
import { StimFeatureExperimentsDomainModule } from '@neuro-server/stim-feature-experiments/domain';
import { StimFeatureFileBrowserModule } from '@neuro-server/stim-feature-file-browser';

import { ExperimentsService } from './services/experiments.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';

@Module({
  imports: [CqrsModule, StimFeatureExperimentsDomainModule, StimFeatureFileBrowserModule.forFeature(), StimLibSocketModule],
  providers: [ExperimentsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class StimFeatureExperimentsApplicationModule {}
