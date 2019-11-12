import { Body, Controller, Get, Logger, Options, Param, Patch, Post, Query } from '@nestjs/common';

import { ResponseObject } from 'diplomka-share';

import { SerialService } from './serial.service';

@Controller('/api/low-level')
export class LowLevelController {

  private readonly logger: Logger = new Logger(LowLevelController.name);

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

  @Post('open')
  public async open(@Body() body: any): Promise<ResponseObject<any>> {
    const path = body.path;
    try {
      await this._serial.open(path);
    } catch (e) {
      this.logger.error(e);
      return { message: { text: `Port '${path}' se nepodařilo otevřít!`, type: 3 } };
    }
    return { message: { text: `Port '${path}' byl úspěšně otevřen.`, type: 0} };
  }

  @Patch('stop')
  public async stop() {
    await this._serial.close();
    return null;
  }

}
