import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSeedDomainModule } from '@diplomka-backend/stim-feature-seed/domain';

import { COMMANDS } from './command/index';
import { EVENTS } from './event/index';
import { QUERIES } from './query/index';
import { SAGAS } from './saga/index';
import { SeederServiceProvider } from './service/seeder-service-provider.service';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

@Module({
  imports: [CqrsModule, StimFeatureSeedDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [...COMMANDS, ...EVENTS, ...QUERIES, ...SAGAS, SeederServiceProvider],
  exports: [SeederServiceProvider],
})
export class StimFeatureSeedApplicationModule {}
