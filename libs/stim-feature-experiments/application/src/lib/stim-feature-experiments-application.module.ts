import { Module } from '@nestjs/common';
import { Validator } from 'jsonschema';

import { ExperimentsService } from './services/experiments.service';

import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
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
  exports: [],
})
export class StimFeatureExperimentsApplicationModule {}
