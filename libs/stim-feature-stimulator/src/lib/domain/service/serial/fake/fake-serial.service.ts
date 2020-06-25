import * as SerialPort from 'serialport';
import * as events from 'events';
import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { PortIsAlreadyOpenException } from '../../../exception/port-is-already-open.exception';
import { PortIsNotOpenException } from '../../../exception/port-is-not-open.exception';
import { SerialService } from '../../serial.service';
import {
  FakeSerialDataEmitter,
  FakeSerialDataHandler,
} from './fake-serial.data-handler';

/**
 * Virtuální implementace služby pro sériovou linku.
 * Použitá bude zejména v testovacím prostředí, kdy nebude možné použít
 * reálný stimulátor.
 */
@Injectable()
export class FakeSerialService extends SerialService {
  public static readonly VIRTUAL_PORT_NAME = 'virtual';

  private _connected = false;
  private _fakeSerialEmiter: events.EventEmitter = new events.EventEmitter();
  private _fakeDataHandler: FakeSerialDataHandler;
  private _fakeResponseDataEmitter: FakeSerialDataEmitter = {
    emit: (buffer: Buffer): void => {
      this._fakeSerialEmiter.emit('data', buffer);
    },
  };

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.logger.verbose('Používám FakeSerialService.');
  }

  public discover(): Promise<SerialPort.PortInfo[]> {
    return new Promise((resolve) => {
      resolve([
        {
          path: FakeSerialService.VIRTUAL_PORT_NAME,
        },
      ]);
    });
  }

  public open(path: string): Promise<void> {
    this.logger.verbose('Otevírám sériový port.');
    if (this._connected) {
      throw new PortIsAlreadyOpenException();
    }

    this._connected = true;
    this._fakeSerialEmiter.on('data', (data: Buffer) =>
      this._handleIncommingData(data)
    );
    this._fakeSerialEmiter.on('close', () => {
      this._connected = false;
      this._handleSerialClosed();
    });
    this._handleSerialOpen(path);
    return Promise.resolve();
  }

  public close(): Promise<any> {
    if (!this._connected) {
      throw new PortIsNotOpenException();
    }

    this._connected = false;
    this._handleSerialClosed();
    return Promise.resolve();
  }

  public write(buffer: Buffer): void {
    this.logger.verbose(`[${buffer.join(',')}]`);
    if (!this.isConnected) {
      this.logger.warn('Někdo se pokouší zapsat na neotevřený port!');
      throw new PortIsNotOpenException();
    }

    this.logger.verbose(`Odesílám příkaz: [${buffer.join(',')}]`);
    this._fakeDataHandler.handle(buffer);
  }

  public get isConnected(): boolean {
    return this._connected;
  }

  public registerFakeDataHandler(
    fakeDataHandler: FakeSerialDataHandler
  ): FakeSerialDataEmitter {
    this._fakeDataHandler = fakeDataHandler;
    return this._fakeResponseDataEmitter;
  }
}
