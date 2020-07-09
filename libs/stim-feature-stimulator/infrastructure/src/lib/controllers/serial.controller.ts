import * as SerialPort from 'serialport';
import { Body, Controller, Get, Logger, Options, Patch, Post } from '@nestjs/common';

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { PortIsAlreadyOpenException, PortIsNotOpenException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialFacade } from '../service/serial.facade';
import { ControllerException } from '@diplomka-backend/stim-lib-common';

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
    this.logger.log('Přišel požadavek na prohledání všech dostupných sériových portů.');
    try {
      const devices = await this.facade.discover();
      return {
        data: devices,
      };
    } catch (e) {
      throw new ControllerException();
    }
  }

  @Post('open')
  public async open(@Body() body: { path: string }): Promise<ResponseObject<any>> {
    this.logger.log('Přišel požadavek na otevření sériového portu.');
    try {
      await this.facade.open(body.path);
      return {
        message: {
          code: 0,
        },
      };
    } catch (e) {
      if (e instanceof PortIsAlreadyOpenException) {
        const error = e as PortIsAlreadyOpenException;
        this.logger.error('Sériový port již je otevřený!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neznámá chyba při otevírání portu!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Patch('stop')
  public async close(): Promise<ResponseObject<any>> {
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
        const error = e as PortIsNotOpenException;
        this.logger.error('Žádný sériový port nebyl otevřený!');
        this.logger.error(error);
        throw new ControllerException(e.errorCode);
      } else {
        this.logger.error('Nastala neznámá chyba při zavírání sériového portu!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Get('status')
  public async status(): Promise<ResponseObject<{ connected: boolean }>> {
    return { data: { connected: await this.facade.status() } };
  }
}
