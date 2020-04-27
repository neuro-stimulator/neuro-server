import { Injectable} from '@nestjs/common';

import * as SerialPort from 'serialport';
import Delimiter = SerialPort.parsers.Delimiter;

import { CommandFromStimulator, MessageCodes, SerialDataEvent } from '@stechy1/diplomka-share';

import { SettingsService } from '../settings/settings.service';
import { parseData } from './protocol/data-parser.protocol';
import { SERIAL_DATA, SERIAL_STATUS } from './serial.gateway.protocol';
import { SerialService } from './serial.service';

/**
 * Implementace služby využívající reálný seriový port
 */
@Injectable()
export class RealSerialService extends SerialService {

  private _serial: SerialPort;

  constructor(settings: SettingsService) {
    super(settings);
    this.logger.debug('Používám RealSerialService.');
  }

  public async discover(): Promise<SerialPort.PortInfo[]> {
    return SerialPort.list();
  }

  public open(path: string = '/dev/ttyACM0'): Promise<void> {
    // Pokud již je vytvořená nějaká instance seriového portu
    if (this._serial !== undefined) {
      this.logger.error(`Port '${path}' je již otevřený!`);
      // Nebudu dál pokračovat a vyhodím vyjímku
      throw new Error('Port je již otevřený!');
    }

    // Jinak vrátím novou promisu
    return new Promise(((resolve, reject) => {
      this.logger.log(`Pokouším se otevřít port: '${path}'.`);
      // Pokusím se vytvořit novou instanci seriového portu
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
          // Nad daty se vytvoří parser, který dokáže oddělit jednotlivé příkazy ze stimulátoru za pomocí delimiteru
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
    this.logger.debug(`[${buffer.join(',')}]`);
    this._serial.write(buffer);
  }

  get isConnected(): boolean {
    return this._serial !== undefined;
  }
}
