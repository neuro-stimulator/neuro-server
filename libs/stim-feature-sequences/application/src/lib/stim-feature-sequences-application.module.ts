import { Module } from '@nestjs/common';

import { Validator } from 'jsonschema';

import { SequencesService } from './services/sequences.service';
import { QueryHandlers } from './queries/index';
import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';

@Module({
  controllers: [],
  providers: [
    SequencesService,
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
export class StimFeatureSequencesApplicationModule {}
