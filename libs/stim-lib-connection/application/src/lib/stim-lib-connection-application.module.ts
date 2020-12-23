import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimLibConnectionDomainModule } from '@diplomka-backend/stim-lib-connection/domain';

import { CommandHandlers } from './command';
import { EventHandlers } from './event';

@Module({
  controllers: [],
  imports: [StimLibConnectionDomainModule, StimLibSocketModule, CqrsModule],
  providers: [...CommandHandlers, ...EventHandlers],
  exports: [],
})
export class StimLibConnectionApplicationModule {}
