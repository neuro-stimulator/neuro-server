import { Injectable, Logger } from '@nestjs/common';

import * as SerialPort from 'serialport';

import { SerialGateway } from './SerialGateway';
import Readline = SerialPort.parsers.Readline;

@Injectable()
export class SerialService {

  private readonly logger = new Logger(SerialService.name);
  private _serial: SerialPort;
  // private readonly _serial = new SerialPort('/dev/pts/4');

  constructor(private readonly _gateway: SerialGateway) {
    // this._serial.on('data', data => {
    //   this.logger.log(data);
    //   this._gateway.sendData(data.toString().trim());
    // });
  }

  public async discover() {
    await this.create();
    await this.open();
    return SerialPort.list();
  }

  public async create(path: string = '/dev/ttyACM0') {
    if (this._serial !== undefined) {
      throw new Error('Port je již otevřený!');
    }

    this._serial = new SerialPort(path, {autoOpen: false, baudRate: 115200});
    this._serial.on('data', data => {
      this.logger.log(data);
      this._gateway.sendData(data.toString().trim());
    });
  }

  public open(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this._serial === undefined) {
        reject('Port nebyl vytvořen!');
        return;
      }
      this._serial.open(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public close(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this._serial === undefined) {
        reject('Port nebyl vytvořen!');
        return;
      }
      this._serial.close(error => {
        if (error) {
          reject(error);
        } else {
          this._serial = undefined;
          resolve();
        }
      });
    });
  }
}
