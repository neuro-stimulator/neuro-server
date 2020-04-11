import { Injectable} from '@nestjs/common';

import * as SerialPort from 'serialport';
import Delimiter = SerialPort.parsers.Delimiter;

import { CommandFromStimulator, MessageCodes, SerialDataEvent } from '@stechy1/diplomka-share';

import { SettingsService } from '../settings/settings.service';
import { parseData } from './protocol/data-parser.protocol';
import { SERIAL_DATA, SERIAL_STATUS } from './serial.gateway.protocol';
import { SerialService } from './serial.service';

@Injectable()
export class RealSerialService extends SerialService {

  private _serial: SerialPort;

  constructor(settings: SettingsService) {
    super(settings);
    this.logger.debug('Používám RealSerialService.');
  }

  private _saveComPort(path: string) {
    // Vytvořím si hlubokou kopii nastavení
    const settings = {...this._settings.settings};
    // Pokud je poslední uložená cesta ke COM portu stejná, nebudu nic ukládat.
    if (settings.comPortName === path) {
      return;
    }

    // COM port je jiný, než ten, co byl posledně použitý
    settings.comPortName = path;
    this._settings.updateSettings(settings).finally();
  }

  private _handleIncommingData(data: Buffer) {
    this.logger.debug('Zpráva ze stimulátoru...');
    this.logger.debug(data);
    const event: SerialDataEvent = parseData(data);
    this.logger.verbose(event);
    if (event === null) {
      this.logger.error('Událost nebyla rozpoznána!!!');
      this.logger.error(data);
      this.logger.debug(data.toString().trim());
      this.publishMessage(SERIAL_DATA, data.toString().trim());
    } else {
      this._events.emit(event.name, event);
      this.publishMessage(SERIAL_DATA, event);
    }
  }

  public async discover(): Promise<SerialPort.PortInfo[]> {
    return SerialPort.list();
  }

  public open(path: string = '/dev/ttyACM0'): Promise<void> {
    if (this._serial !== undefined) {
      this.logger.error(`Port '${path}' je již otevřený!`);
      throw new Error('Port je již otevřený!');
    }

    return new Promise(((resolve, reject) => {
      this.logger.log(`Pokouším se otevřít port: '${path}'.`);
      this._serial = new SerialPort(path, { baudRate: 9600 }, (error) => {
        if (error instanceof Error) {
          this.logger.error(`Port '${path}' se nepodařilo otevřít!`);
          this.logger.error(error);
          this._serial = undefined;
          reject(error);
        } else {
          this.logger.log(`Port '${path}' byl úspěšně otevřen.`);
          this._saveComPort(path);
          this.publishMessage(SERIAL_STATUS, {connected: true});
          const parser = this._serial.pipe(new Delimiter({ delimiter: CommandFromStimulator.COMMAND_DELIMITER, includeDelimiter: false }));
          parser.on('data', (data: Buffer) => this._handleIncommingData(data));
          this._serial.on('close', () => {
            this.logger.warn('Seriový port byl uzavřen!');
            this.publishMessage(SERIAL_STATUS, {connected: false});
            this._serial = undefined;
          });
          resolve();
        }
      });
    }));

  }

  public close(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.isConnected) {
        reject(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN);
        return;
      }
      this._serial.close((error: Error | undefined) => {
        if (error) {
          reject(error);
        } else {
          this._serial = undefined;
          this.publishMessage(SERIAL_STATUS, {connected: false});
          resolve();
        }
      });
    });
  }

  public write(buffer: Buffer): void {
    if (!this.isConnected) {
      this.logger.warn('Někdo se pokouší zapsat na neotevřený port!');
      throw new Error(`${MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN}`);
    }
    this.logger.debug('Zapisuji zprávu na seriový port...');
    this.logger.debug(buffer);
    this._serial.write(buffer);
  }

  get isConnected(): boolean {
    return this._serial !== undefined;
  }
}
