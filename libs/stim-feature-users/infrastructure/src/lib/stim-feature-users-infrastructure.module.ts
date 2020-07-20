import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureUsersApplicationModule } from '@diplomka-backend/stim-feature-users/application';

import { UsersController } from './controller/users.controller';
import { UsersFacade } from './service/users.facade';

@Module({
  controllers: [UsersController],
  imports: [CqrsModule, StimFeatureUsersApplicationModule],
  providers: [UsersFacade],
  exports: [],
})
export class StimFeatureUsersInfrastructureModule {}
