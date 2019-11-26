import { Body, Controller, Get, Logger, Options, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { exec } from 'child_process';

import { ResponseObject } from 'diplomka-share';

import { SerialService } from './serial.service';
import { UploadedFileStructure } from '../share/utils';

@Controller('/api/low-level')
export class LowLevelController {

  private static readonly DELIMITER = 0x53;

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

  @Patch('experiment/start')
  public startExperiment() {
    const buffer = Buffer.from([0x03, 0x01, LowLevelController.DELIMITER]);
    this._serial.write(buffer);
  }

  @Patch('experiment/stop')
  public stopExperiment() {
    const buffer = Buffer.from([0x03, 0x00, LowLevelController.DELIMITER]);
    this._serial.write(buffer);
  }

  @Patch('stimul-config/:index/:up/:down/:brightness')
  public stimulConfig(@Param() params: {index: number, up: number, down: number, brightness: number}) {
    const buffer = Buffer.from([0x04, +params.index, +params.up, +params.down, +params.brightness, LowLevelController.DELIMITER]);
    this._serial.write(buffer);
  }

  @Patch('toggle-led/:index/:enabled')
  public toggleLed(@Param() params: {index: number, enabled: number}) {
    this.logger.verbose(`Prepinam ledku na: ${params.enabled}`);
    const buffer = Buffer.from([0x05, +params.index, +params.enabled === 1 ? 0x01 : 0x00, LowLevelController.DELIMITER]);
    this._serial.write(buffer);

  }

}
