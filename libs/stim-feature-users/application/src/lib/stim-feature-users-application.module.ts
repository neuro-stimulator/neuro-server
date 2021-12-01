import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureUsersDomainModule } from '@neuro-server/stim-feature-users/domain';

import { UsersService } from './service/users.service';
import { QUERIES } from './query';
import { EVENTS } from './event';
import { COMMANDS } from './command';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureUsersDomainModule],
  providers: [
    ...QUERIES,
    ...COMMANDS,
    ...EVENTS,
    UsersService
  ],
  exports: [],
})
export class StimFeatureUsersApplicationModule {}
