import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';

import { QueryHandlers } from './application/queries';
import { CommandHandlers } from './application/commands';
import { EventHandlers } from './application/event';
import { Sagas } from './application/sagas';
import { IpcService } from './domain/services/ipc.service';
import { IpcController } from './infrastructure/controller/ipc.controller';
import { IpcFacade } from './infrastructure/service/ipc.facade';

@Module({
  controllers: [IpcController],
  imports: [CqrsModule, StimLibSocketModule],
  providers: [
    IpcService,
    IpcFacade,

    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
  ],
  exports: [IpcFacade],
})
export class StimFeatureIpcModule {}
