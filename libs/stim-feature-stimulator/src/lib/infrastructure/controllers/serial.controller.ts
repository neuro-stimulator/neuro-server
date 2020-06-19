import * as SerialPort from 'serialport';
import {
  Body,
  Controller,
  Get,
  Logger,
  Options,
  Patch,
  Post,
} from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { SerialFacade } from '../service/serial.facade';
import {
  PortIsAlreadyOpenException,
  PortIsNotOpenException,
} from '../../domain/exception';

@Controller('/api/serial')
export class SerialController {
  private readonly logger: Logger = new Logger(SerialController.name);

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
  public async discover(): Promise<ResponseObject<SerialPort.PortInfo[]>> {
    this.logger.log(
      'Přišel požadavek na prohledání všech dostupných sériových portů.'
    );
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
  public async open(
    @Body() body: { path: string }
  ): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na otevření sériového portu.');
    console.log(body);
    try {
      await this.facade.open(body.path);
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof PortIsAlreadyOpenException) {
        this.logger.error('Sériový port již je otevřený!');
        return {
          message: {
            code: 50304,
          },
        };
      } else {
        this.logger.error('Nastala neznámá chyba při otevírání portu!');
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
      // TODO error handling
    }
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
  public async stop(): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na zavření sériového portu.');
    try {
      await this.facade.close();
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof PortIsNotOpenException) {
        this.logger.error('Žádný sériový port nebyl otevřený!');
        return {
          message: {
            code: MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN,
          },
        };
      } else {
        this.logger.error(
          'Nastala neznámá chyba při zavírání sériového portu!'
        );
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
      // TODO error handling
    }
  }

  @Get('status')
  public async status(): Promise<ResponseObject<{ connected: boolean }>> {
    return { data: { connected: await this.facade.status() } };
  }

  // @Post('firmware')
  // @UseInterceptors(FileInterceptor('firmware'))
  // public async updateFirmware(): Promise<ResponseObject<any>> {
  //   return {};
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
  // }
}
