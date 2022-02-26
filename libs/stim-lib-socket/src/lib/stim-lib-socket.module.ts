import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SocketCommands } from './application/commands';
import { Sagas } from './application/saga';
import { SocketService } from './domain/services/socket.service';
import { SocketFacade } from './infrastructure/service/socket.facade';

@Module({
  imports: [CqrsModule],
  providers: [SocketService, SocketFacade, ...SocketCommands, ...Sagas],
  exports: [SocketFacade],
})
export class StimLibSocketModule {}
