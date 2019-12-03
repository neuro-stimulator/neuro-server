import { Injectable, Logger } from '@nestjs/common';

import * as SerialPort from 'serialport';

import { SerialGateway } from './serial.gateway';


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
    return SerialPort.list();
  }

  public open(path: string = '/dev/ttyACM0') {

    if (this._serial !== undefined) {
      this.logger.error(`Port '${path}' je již otevřený!`);
      throw new Error('Port je již otevřený!');
    }

    return new Promise(((resolve, reject) => {
      this._serial = new SerialPort(path, { baudRate: 9600 }, (error) => {
        if (error instanceof Error) {
          this.logger.error(`Port '${path}' se nepodařilo otevřít!`);
          reject(error);
        } else {
          this.logger.log(`Port '${path}' byl úspěšně otevřen.`);
          this._gateway.updateStatus({connected: true});
          this._serial.on('data', data => {
            this.logger.log(data);
            this._gateway.sendData(data.toString()
                                       .trim());
          });
          resolve();
        }
      });
    }));

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
          this._gateway.updateStatus({connected: false});
          resolve();
        }
      });
    });
  }

  public write(buffer: Buffer) {
    this.logger.debug('Zapisuji zprávu na seriový port...');
    this.logger.debug(buffer);
    this._serial.write(buffer);
  }

  get isConnected() {
    return this._serial !== undefined;
  }
}
