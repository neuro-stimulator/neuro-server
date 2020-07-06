import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Validator } from 'jsonschema';

import { ExperimentResultsService } from './services/experiment-results.service';
import { QueryHandlers } from './queries/index';
import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';
import { Sagas } from './sagas/index';

@Module({
  imports: [CqrsModule],
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
