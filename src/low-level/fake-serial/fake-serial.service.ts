import * as SerialPort from 'serialport';
import * as events from 'events';

import { SettingsService } from '../../settings/settings.service';
import { SerialService } from '../serial.service';
import { MessageCodes } from '@stechy1/diplomka-share';
import { SERIAL_STATUS } from '../serial.gateway.protocol';
import { FakeSerialDataEmitter, FakeSerialDataHandler } from './fake-serial.data-handler';

/**
 * Virtuální implementace služby pro sériovou linku.
 * Použitá bude zejména v testovacím prostředí, kdy nebude možné použít
 * reálný stimulátor.
 */
export class FakeSerialService extends SerialService {

  private static readonly VIRTUAL_PORT_NAME = 'virtual';

  private _connected = false;
  private _fakeSerialEmiter: events.EventEmitter = new events.EventEmitter();
  private _fakeDataHandler: FakeSerialDataHandler;
  private _fakeResponseDataEmitter: FakeSerialDataEmitter = {
    emit: (buffer: Buffer): void => {
      this._fakeSerialEmiter.emit('data', buffer);
    }
  };

  constructor(settings: SettingsService) {
    super(settings);
    this.logger.debug('Používám FakeSerialService.');
  }

  public discover(): Promise<SerialPort.PortInfo[]> {
    return new Promise((resolve) => {
      resolve([
        {
          path: FakeSerialService.VIRTUAL_PORT_NAME
        }
      ]);
    });
  }

  public open(path: string): Promise<void> {
    if (this._connected) {
      throw new Error('Port je již otevřený!');
    }

    this._saveComPort(path);
    this._fakeSerialEmiter.on('data', (data: Buffer) => this._handleIncommingData(data));
    this._fakeSerialEmiter.on('close', () => {
      this.publishMessage(SERIAL_STATUS, {connected: false});
      this._connected = false;
    });
    this._connected = true;
    this.publishMessage(SERIAL_STATUS, {connected: true});
    return Promise.resolve();
  }

  public close(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._connected) {
        reject(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN);
      }

      this._connected = false;
      this.publishMessage(SERIAL_STATUS, {connected: false});
      return Promise.resolve();
    });
  }

  public write(buffer: Buffer): void {
    this._fakeDataHandler.handle(buffer);
  }

  public get isConnected(): boolean {
    return this._connected;
  }

  public registerFakeDataHandler(fakeDataHandler: FakeSerialDataHandler): FakeSerialDataEmitter {
    this._fakeDataHandler = fakeDataHandler;
    return this._fakeResponseDataEmitter;
  }
}
