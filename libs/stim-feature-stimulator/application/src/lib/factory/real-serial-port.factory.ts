import { PortInfo } from '@serialport/bindings-interface';
import { SerialPort as RealSerialPort } from 'serialport';

import { Logger } from '@nestjs/common';

import { SerialPort, SerialPortOpenSettings } from '@neuro-server/stim-feature-stimulator/domain';

import { SerialPortFactory } from './serial-port.factory';

/**
 * Továrna na instance reálného sériového portu
 */
export class RealSerialPortFactory extends SerialPortFactory {
  private readonly logger: Logger = new Logger(RealSerialPortFactory.name);

  public createSerialPort(path: string, settings: SerialPortOpenSettings, callback: (error?: (Error | null)) => void): SerialPort {
    this.logger.verbose('Vytvářím instanci reálné sériové linky.');
    settings.path = path;
    return new RealSerialPort(settings, callback);
  }

  list(): Promise<Record<string, unknown>[]> {
    return RealSerialPort.list().then((portInfos: PortInfo[]) => {
      return portInfos.map((value: PortInfo) => {
        const result = {};
        for (const key of Object.keys(value)) {
          result[key] = value[key];
        }
        return result;
      });
    });
  }
}
