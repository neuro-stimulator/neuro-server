import { Injectable, Logger } from '@nestjs/common';

import * as events from 'events';
import * as SerialPort from 'serialport';
import Delimiter = SerialPort.parsers.Delimiter;

import { CommandFromStimulator } from 'diplomka-share';

import { HwEvent } from './protocol/hw-events';
import { parseData } from './protocol/data-parser.protocol';
import { MessagePublisher } from '../share/utils';
import { SERIAL_DATA, SERIAL_STATUS } from './serial.gateway.protocol';


@Injectable()
export class SerialService implements MessagePublisher {

  private readonly logger = new Logger(SerialService.name);

  private readonly _events: events.EventEmitter = new events.EventEmitter();

  private _serial: SerialPort;
  private _publishMessage: (topic: string, data: any) => void;

  constructor() {}

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
          this.logger.error(error);
          reject(error);
        } else {
          this.logger.log(`Port '${path}' byl úspěšně otevřen.`);
          this._publishMessage(SERIAL_STATUS, {connected: true});
          const parser = this._serial.pipe(new Delimiter({ delimiter: CommandFromStimulator.COMMAND_DELIMITER, includeDelimiter: false }));
          parser.on('data', (data: Buffer) => {
            const event: HwEvent = parseData(data);
            if (event === null) {
              this.logger.error('Událost nebyla rozpoznána!!!');
              this.logger.error(data);
              this.logger.debug(data.toString().trim());
              this._publishMessage(SERIAL_DATA, data.toString().trim());
            } else {
              this._events.emit(event.name, event);
              this._publishMessage(SERIAL_DATA, data.toString().trim());
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
          this._publishMessage(SERIAL_STATUS, {connected: false});
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

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }
}
