import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureUsersDomainModule } from '@neuro-server/stim-feature-users/domain';

import { COMMANDS } from './command';
import { EVENTS } from './event';
import { QUERIES } from './query';
import { UsersService } from './service/users.service';

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
