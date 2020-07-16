import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DtoFactory, StimLibCommonModule } from '@diplomka-backend/stim-lib-common';
import { ExperimentCvepDTO, StimFeatureExperimentsDomainModule } from '@diplomka-backend/stim-feature-experiments/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentsService } from './services/experiments.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { ExperimentType } from '@stechy1/diplomka-share';

@Module({
  imports: [CqrsModule, StimFeatureExperimentsDomainModule, StimFeatureFileBrowserModule.forFeature(), StimLibCommonModule],
  providers: [ExperimentsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class StimFeatureExperimentsApplicationModule {}
