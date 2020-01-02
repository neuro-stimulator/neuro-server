import { Body, Controller, Get, Logger, Options, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { exec } from 'child_process';

import { ResponseObject } from 'diplomka-share';

import { SerialService } from './serial.service';
import { UploadedFileStructure } from '../share/utils';

@Controller('/api/low-level')
export class LowLevelController {

  private readonly logger: Logger = new Logger(LowLevelController.name);

  constructor(private readonly _serial: SerialService) {}

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
  public async updateFirmware(@UploadedFile() firmware: UploadedFileStructure): Promise<ResponseObject<any>> {
    this.logger.verbose(firmware);
    return new Promise((resolve, reject) => {
      // firmware.path = "/tmp/firmware/some_random_name"
      exec(`sudo cp ${firmware.path} /mnt/stm/firmware.bin`, (err, stdout, stderr) => {
        if (err) {
          // some err occurred
          this.logger.error(err);
          resolve(err);
        } else {
          // the *entire* stdout and stderr (buffered)
          this.logger.log(`stdout: ${stdout}`);
          this.logger.error(`stderr: ${stderr}`);
          resolve();
        }
      });
    })
      .then((err) => {
        return {
          message: {
            text: err
              ? 'Firmware se nepodařilo aktualizovat!'
              : 'Firmware byl úspěšně aktualizován.',
            type: err ? 3 : 0 } };
    });

  }

}
