import { Logger } from '@nestjs/common';

import * as RealSerialPort from 'serialport';

import { SerialPort } from '@neuro-server/stim-feature-stimulator/domain';

import { SerialPortFactory } from './serial-port.factory';

/**
 * Továrna na instance reálného sériového portu
 */
export class RealSerialPortFactory extends SerialPortFactory {
  private readonly logger: Logger = new Logger(RealSerialPortFactory.name);

  public createSerialPort(path: string, settings: Record<string, unknown>, callback: (error?: Error | null) => void): SerialPort {
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
