import { Module } from '@nestjs/common';

import { IpcService } from './ipc.service';
import { ExperimentsModule } from '../experiments/experiments.module';
import { LowLevelModule } from '../low-level/low-level.module';

@Module({
  providers: [
    IpcService
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
