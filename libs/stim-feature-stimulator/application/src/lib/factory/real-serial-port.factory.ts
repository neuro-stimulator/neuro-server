import { Logger } from '@nestjs/common';

import * as RealSerialPort from 'serialport';

import { SerialPortFactory } from './serial-port.factory';

import { SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';

/**
 * Továrna na instance reálného sériového portu
 */
export class RealSerialPortFactory extends SerialPortFactory {
  private readonly logger: Logger = new Logger(RealSerialPortFactory.name);

  public createSerialPort(path: string, settings: Record<string, unknown>, callback: (error) => void): SerialPort {
    this.logger.verbose('Vytvářím instanci reálné sériové linky.');
    return new RealSerialPort(path, settings, callback);
  }

  list(): Promise<Record<string, unknown>[]> {
    return RealSerialPort.list().then((portInfos: RealSerialPort.PortInfo[]) => {
      return portInfos.map((value: RealSerialPort.PortInfo) => {
        const result = {};
        for (const key of Object.keys(value)) {
          result[key] = value[key];
        }
        return result;
      });
    });
  }
}
