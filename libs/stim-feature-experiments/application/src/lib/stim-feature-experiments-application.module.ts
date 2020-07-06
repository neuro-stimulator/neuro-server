import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Validator } from 'jsonschema';

import { StimFeatureExperimentsDomainModule } from '@diplomka-backend/stim-feature-experiments/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentsService } from './services/experiments.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';

@Module({
  imports: [CqrsModule, StimFeatureExperimentsDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [
    ExperimentsService,

    {
      provide: Validator,
      useClass: Validator,
    },

    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class StimFeatureExperimentsApplicationModule {}
