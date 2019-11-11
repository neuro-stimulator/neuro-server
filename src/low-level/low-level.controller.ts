import { Controller, Get, Options, Patch } from '@nestjs/common';

import { ResponseObject } from 'diplomka-share';

import { SerialService } from './SerialService';

@Controller('/api/low-level')
export class LowLevelController {

  constructor(private readonly _serial: SerialService) {
  }

  @Get('discover')
  public async discover(): Promise<ResponseObject<any>> {
    return { data: await this._serial.discover() };
  }

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Patch('stop')
  public async stop() {
    await this._serial.close();
    return null;
  }

}
