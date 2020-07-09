import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SocketCommands } from './application/commands';
import { SocketService } from './domain/services/socket.service';
import { SocketFacade } from './infrastructure/service/socket.facade';

@Module({
  imports: [CqrsModule],
  providers: [SocketService, SocketFacade, ...SocketCommands],
  exports: [SocketFacade],
})
export class StimLibSocketModule {}
