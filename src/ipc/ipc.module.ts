import { Module } from '@nestjs/common';

import { IpcService } from './ipc.service';
import { ExperimentsModule } from '../experiments/experiments.module';
import { LowLevelModule } from '../low-level/low-level.module';
import { IpcController } from './ipc.controller';
import { IpcGateway } from './ipc.gateway';

@Module({
  controllers: [
    IpcController
  ],
  providers: [
    IpcService,
    IpcGateway,
  ],
  imports: [
    ExperimentsModule,
    LowLevelModule
  ],
  exports: [
    IpcService
  ]
})
export class IpcModule {

}
