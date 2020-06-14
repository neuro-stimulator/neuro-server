import { exec } from 'child_process';

import { Body, Controller, Get, Logger, Options, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { UploadedFileStructure } from "../share/utils";
import { SerialService } from "./serial.service";

@Controller('/api/low-level')
export class LowLevelController {

  private readonly logger: Logger = new Logger(LowLevelController.name);

  constructor(private readonly _serial: SerialService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get('discover')
  public async discover(): Promise<ResponseObject<any>> {
    return { data: await this._serial.discover() };
  }

  @Post('open')
  public async open(@Body() body: any): Promise<ResponseObject<any>> {
    let code = MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPPENED;
    const path = body.path;
    try {
      await this._serial.open(path);
      code = MessageCodes.CODE_SUCCESS_LOW_LEVEL_PORT_OPPENED;
    } catch (e) {
      this.logger.error(e.message);
    }

    return {
      message: {
        code,
        params: { path }
      }
    };
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
          this.logger.debug(`stdout: ${stdout}`);
          this.logger.error(`stderr: ${stderr}`);
          resolve();
        }
      });
    })
      .then((err) => {
        return {
          message: {
            code: err
              ? MessageCodes.CODE_ERROR_LOW_LEVEL_FIRMWARE_NOT_UPDATED
              : MessageCodes.CODE_SUCCESS_LOW_LEVEL_FIRMWARE_UPDATED
            }
        };
    });
  }
}
