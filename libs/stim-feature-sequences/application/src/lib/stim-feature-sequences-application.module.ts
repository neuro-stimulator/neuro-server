import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Validator } from 'jsonschema';

import { StimFeatureSequencesDomainModule } from '@diplomka-backend/stim-feature-sequences/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { SequencesService } from './services/sequences.service';
import { QueryHandlers } from './queries/index';
import { CommandHandlers } from './commands/index';
import { EventHandlers } from './event/index';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureSequencesDomainModule, StimFeatureFileBrowserModule.forFeature()],
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
