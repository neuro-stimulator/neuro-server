import {
  Body,
  Controller,
  Get,
  Options,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ResponseObject } from '@stechy1/diplomka-share';
import { FileInterceptor } from '@nestjs/platform-express';

import { SerialFacade } from '../service/serial.facade';

@Controller('/api/serial')
export class SerialController {
  constructor(private readonly facade: SerialFacade) {}

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
    try {
      const devices = await this.facade.discover();
      return {
        data: devices,
      };
    } catch (e) {
      // TODO error handling
      return {};
    }
  }

  @Post('open')
  public async open(@Body() body: any): Promise<ResponseObject<any>> {
    try {
      await this.facade.open(body);
    } catch (e) {
      // TODO error handling
    }
    return {};
    // let code = MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPPENED;
    // const path = body.path;
    // try {
    //   await this._serial.open(path);
    //   code = MessageCodes.CODE_SUCCESS_LOW_LEVEL_PORT_OPPENED;
    // } catch (e) {
    //   this.logger.error(e.message);
    // }
    //
    // return {
    //   message: {
    //     code,
    //     params: { path }
    //   }
    // };
  }

  @Patch('stop')
  public async stop() {
    try {
      await this.facade.close();
    } catch (e) {
      // TODO error handling
    }
    // await this._serial.close();
    // return null;
  }

  @Get('status')
  public async status(): Promise<ResponseObject<{ connected: boolean }>> {
    return { data: { connected: await this.facade.status() } };
  }

  @Post('firmware')
  @UseInterceptors(FileInterceptor('firmware'))
  public async updateFirmware(
    @UploadedFile() firmware /*: UploadedFileStructure*/
  ): Promise<ResponseObject<any>> {
    return {};
    //   this.logger.verbose(firmware);
    //   return new Promise((resolve, reject) => {
    //     // firmware.path = "/tmp/firmware/some_random_name"
    //     exec(`sudo cp ${firmware.path} /mnt/stm/firmware.bin`, (err, stdout, stderr) => {
    //       if (err) {
    //         // some err occurred
    //         this.logger.error(err);
    //         resolve(err);
    //       } else {
    //         // the *entire* stdout and stderr (buffered)
    //         this.logger.debug(`stdout: ${stdout}`);
    //         this.logger.error(`stderr: ${stderr}`);
    //         resolve();
    //       }
    //     });
    //   })
    //   .then((err) => {
    //     return {
    //       message: {
    //         code: err
    //           ? MessageCodes.CODE_ERROR_LOW_LEVEL_FIRMWARE_NOT_UPDATED
    //           : MessageCodes.CODE_SUCCESS_LOW_LEVEL_FIRMWARE_UPDATED
    //       }
    //     };
    //   });
  }
}
