import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Validator } from 'jsonschema';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureStimulatorInfrastructureModule } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { StimFeatureExperimentResultsDomainModule } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { StimFeatureExperimentsInfrastructureModule } from '@diplomka-backend/stim-feature-experiments/infrastructure';

import { ExperimentResultsService } from './services/experiment-results.service';
import { QueryHandlers } from './queries/index';
import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';
import { Sagas } from './sagas/index';

@Module({
  imports: [
    CqrsModule,
    StimLibSocketModule,
    StimFeatureFileBrowserModule.forFeature(),
    StimFeatureStimulatorInfrastructureModule.forFeature(),
    StimFeatureExperimentResultsDomainModule,
    StimFeatureExperimentsInfrastructureModule,
  ],
  providers: [
    ExperimentResultsService,
    {
      provide: Validator,
      useClass: Validator,
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
  ],
  exports: [],
})
export class StimFeatureExperimentResultsApplicationModule {}
