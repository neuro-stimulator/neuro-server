import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureUsersDomainModule } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from './service/users.service';
import { QueryHandlers } from './query/index';
import { EventHandlers } from './event/index';
import { CommandHandlers } from './command/index';

@Module({
  controllers: [],
  imports: [CqrsModule, StimFeatureUsersDomainModule],
  providers: [UsersService, ...QueryHandlers, ...CommandHandlers, ...EventHandlers],
  exports: [],
})
export class StimFeatureUsersApplicationModule {}
