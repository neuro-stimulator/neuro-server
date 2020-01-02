import { Module } from '@nestjs/common';
import { IpcService } from './ipc.service';

@Module({
  providers: [
    IpcService
  ]
})
export class IpcModule {

}
