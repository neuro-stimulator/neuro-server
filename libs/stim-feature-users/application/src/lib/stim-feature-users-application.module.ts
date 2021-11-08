import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureUsersDomainModule } from '@neuro-server/stim-feature-users/domain';

import { UsersService } from './service/users.service';
import { QueryHandlers } from './query';
import { EventHandlers } from './event';
import { CommandHandlers } from './command';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureUsersDomainModule],
  providers: [UsersService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
  exports: [],
})
export class StimFeatureUsersApplicationModule {}
