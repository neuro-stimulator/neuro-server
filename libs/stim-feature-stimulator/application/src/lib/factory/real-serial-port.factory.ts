import * as RealSerialPort from 'serialport';

import { SerialPortFactory } from './serial-port.factory';

import { SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';
import { Logger } from '@nestjs/common';

/**
 * Továrna na instance reálného sériového portu
 */
export class RealSerialPortFactory extends SerialPortFactory {
  private readonly logger: Logger = new Logger(RealSerialPortFactory.name);

  public createSerialPort(path: string, settings: RealSerialPort.OpenOptions, callback: (error) => void): SerialPort {
    this.logger.verbose('Vytvářím instanci reálné sériové linky.');
    return new RealSerialPort(path, settings, callback);
  }

  list(): Promise<RealSerialPort.PortInfo[]> {
    return RealSerialPort.list();
  }
}
