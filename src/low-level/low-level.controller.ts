import { Body, Controller, Get, Logger, Options, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResponseObject } from 'diplomka-share';

import { SerialService } from './serial.service';
import { UploadedFileStructure } from '../share/utils';

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

  @Get('status')
  public async status(): Promise<ResponseObject<{connected: boolean}>> {
    return {data: {connected: this._serial.isConnected}};
  }

  @Post('firmware')
  @UseInterceptors(
    FileInterceptor('firmware')
  )
  public async updateFirmware(@UploadedFile() firmware: UploadedFileStructure) {
    // TODO zpracovat nahraný soubor
    return null;
  }

}
