import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureIpcApplicationModule } from '@diplomka-backend/stim-feature-ipc/application';

import { IpcController } from './controller/ipc.controller';
import { IpcFacade } from './service/ipc.facade';

@Module({
  controllers: [IpcController],
  imports: [CqrsModule, StimFeatureIpcApplicationModule],
  providers: [IpcFacade],
  exports: [IpcFacade],
})
export class StimFeatureIpcInfrastructureModule {}
