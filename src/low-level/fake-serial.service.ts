import { Logger } from '@nestjs/common';

import * as SerialPort from 'serialport';

import { SettingsService } from '../settings/settings.service';
import { SerialService } from './serial.service';

/**
 * Virtuální implementace služby pro sériovou linku.
 * Použitá bude zejména v testovacím prostředí, kdy nebude možné použít
 * reálný stimulátor.
 */
export class FakeSerialService extends SerialService {

  private readonly logger: Logger = new Logger(FakeSerialService.name);

  constructor(private readonly _settings: SettingsService) {
    super();
    this.logger.debug('Používám FakeSerialService.');
  }

  public discover(): Promise<SerialPort.PortInfo[]> {
    return new Promise(resolve => {
      resolve([]);
    });
  }

  public open(path: string): Promise<void> {
    return Promise.resolve();
  }

  public close(): Promise<any> {
    return Promise.resolve();
  }

  public write(buffer: Buffer): void {
  }

  public bindEvent(name: string, listener: (data: any) => void): void {
  }

  public unbindEvent(name: string, listener: (data: any) => void): void {
  }

  public tryAutoopenComPort(): void {
  }

  public registerMessagePublisher(messagePublisher: (topic: string, data: any) => void): void {
  }

  public publishMessage(topic: string, data: any): void {
  }

  public get isConnected(): boolean {
    return false;
  }

}
