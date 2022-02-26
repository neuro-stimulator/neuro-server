import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ExperimentType } from '@stechy1/diplomka-share';

import { DTO_SCOPE, StimFeatureExperimentsDomainModule } from '@neuro-server/stim-feature-experiments/domain';
import { StimLibDtoModule } from '@neuro-server/stim-lib-dto';
import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';

import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { QueryHandlers } from './queries';
import { ExperimentsService } from './services/experiments.service';

@Module({
  imports: [
    CqrsModule,
    StimLibDtoModule.forFeature<ExperimentType>(DTO_SCOPE),
    StimFeatureExperimentsDomainModule,
    StimLibSocketModule
  ],
  providers: [ExperimentsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class StimFeatureExperimentsApplicationModule {}
