import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { PortIsNotOpenException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialPortFactory } from '../../../factory/serial-port.factory';
import { SerialService } from '../../serial.service';

/**
 * Implementace služby využívající reálný seriový port
 */
@Injectable()
export class RealSerialService extends SerialService {
  constructor(eventBus: EventBus, factory: SerialPortFactory) {
    super(eventBus, factory);
    this.logger.log('Používám RealSerialService.');
  }

  public write(buffer: Buffer): void {
    this.logger.verbose('Zapisuji data.');
    if (!this.isConnected) {
      this.logger.warn('Někdo se pokouší zapsat na neotevřený port!');
      throw new PortIsNotOpenException();
    }
    this.logger.verbose('Zapisuji zprávu na seriový port...');
    this.logger.verbose(`[${buffer.join(',')}]`);
    this._serial.write(buffer);
  }
}
