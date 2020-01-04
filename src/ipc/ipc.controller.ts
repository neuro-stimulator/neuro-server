import { Controller, Get } from '@nestjs/common';

import { ResponseObject } from 'diplomka-share';

import { IpcService } from './ipc.service';

@Controller('/api/ipc')
export class IpcController {

  constructor(private readonly _service: IpcService) {}

  @Get('status')
  public async status(): Promise<ResponseObject<{connected: boolean}>> {
    return {data: {connected: this._service.isConnected}};
  }

}
