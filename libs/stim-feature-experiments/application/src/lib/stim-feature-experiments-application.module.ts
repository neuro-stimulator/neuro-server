import { Module} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibCommonModule } from '@diplomka-backend/stim-lib-common';
import { StimFeatureExperimentsDomainModule } from '@diplomka-backend/stim-feature-experiments/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentsService } from './services/experiments.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';

@Module({
  imports: [CqrsModule, StimFeatureExperimentsDomainModule, StimFeatureFileBrowserModule.forFeature(), StimLibCommonModule],
  providers: [ExperimentsService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
})
export class StimFeatureExperimentsApplicationModule {}
