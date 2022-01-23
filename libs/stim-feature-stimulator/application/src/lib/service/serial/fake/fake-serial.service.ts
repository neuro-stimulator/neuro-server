import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { LOG_TAG, PortIsNotOpenException } from '@neuro-server/stim-feature-stimulator/domain';

import { SerialPortFactory } from '../../../factory/serial-port.factory';
import { SerialService } from '../../serial.service';
import { FakeSerialDataEmitter, FakeSerialDataHandler } from './fake-serial.data-handler';

/**
 * Virtuální implementace služby pro sériovou linku.
 * Použitá bude zejména v testovacím prostředí, kdy nebude možné použít
 * reálný stimulátor.
 */
@Injectable()
export class FakeSerialService extends SerialService {
  private _fakeDataHandler: FakeSerialDataHandler;
  private _fakeResponseDataEmitter: FakeSerialDataEmitter = {
    emit: (buffer: Buffer): void => {
      this._serial.write(buffer);
    },
  };

  constructor(eventBus: EventBus, factory: SerialPortFactory) {
    super(eventBus, factory);
    this.logger.log('Používám FakeSerialService.');
  }

  public write(buffer: Buffer): void {
    if (!this.isConnected) {
      this.logger.warn('Někdo se pokouší zapsat na neotevřený port!');
      throw new PortIsNotOpenException();
    }

    this.logger.verbose({ message: 'Zapisuji zprávu na seriový port...', label: LOG_TAG });
    this.logger.verbose({ message: `[${buffer.join(',')}]`, label: LOG_TAG });
    this._fakeDataHandler.handle(buffer);
  }

  public registerFakeDataHandler(fakeDataHandler: FakeSerialDataHandler): FakeSerialDataEmitter {
    this._fakeDataHandler = fakeDataHandler;
    return this._fakeResponseDataEmitter;
  }
}
