import { Injectable, Logger } from '@nestjs/common';

import * as SerialPort from 'serialport';

import { SerialGateway } from './serial.gateway';
import Delimiter = SerialPort.parsers.Delimiter;
import { COMMAND_DELIMITER } from '../commands/protocol/commands.protocol';
import { HwEvent } from './protocol/hw-events';
import { parseData } from './protocol/data-parser.protocol';
import * as events from 'events';


@Injectable()
export class SerialService {

  private readonly logger = new Logger(SerialService.name);

  private readonly _events: events.EventEmitter = new events.EventEmitter();

  private _serial: SerialPort;

  constructor(private readonly _gateway: SerialGateway) {}

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
          const parser = this._serial.pipe(new Delimiter({ delimiter: [COMMAND_DELIMITER], includeDelimiter: false }));
          parser.on('data', (data: Buffer) => {
            this.logger.log(data);
            const event: HwEvent = parseData(data);
            if (event === null) {
              this._gateway.sendData(data.toString()
                                         .trim());
            } else {
              this._events.emit(event.name, event);
              this._gateway.sendData(event);
            }
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

  public bindEvent(name: string, listener: (data: any) => void) {
    this._events.on(name, listener);
  }

  get isConnected() {
    return this._serial !== undefined;
  }
}
