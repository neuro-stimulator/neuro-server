import { Logger } from '@nestjs/common';

import { FakeSerialDataEmitter, FakeSerialDataHandler } from './fake-serial.data-handler';

/**
 * Abstraktní třída obsahují logiku pro zpracování dat ze serveru
 * a zároveň tvorbu příkazů místo stimulátoru.
 */
export abstract class FakeSerialResponder implements FakeSerialDataHandler {
  protected readonly logger: Logger = new Logger(FakeSerialResponder.name);

  private _fakeSerialDataEmitter: FakeSerialDataEmitter;

  /**
   * Vrátí seznam všech příkazů, které třída podporuje.
   */
  protected abstract get commandMap(): CommandMap;

  /**
   * Odešle data na server (místo stimulátoru)
   *
   * @param buffer Binární data, která se odešlou.
   */
  protected emitData(buffer: Buffer): void {
    this._fakeSerialDataEmitter.emit(buffer);
  }

  /**
   * Zpracuje data, která přišla ze serveru.
   *
   * @param buffer Binární data.
   */
  public handle(buffer: Buffer): void {
    this.logger.debug('Handluju data...');
    let offset = 0;
    try {
      const commandID: number = buffer.readUInt8(offset++);
      const cmd = buffer.readUInt8(offset++);
      this.logger.debug(`{commandID=${commandID}, cmd=${cmd}}`);
      this.commandMap[cmd](commandID, buffer, offset);
    } catch (e) {
      this.logger.error('Nepodařilo se vykonat příkaz.');
      this.logger.error(e.message);
      this.logger.error(e.trace);
    }
  }

  public registerFakeDataEmitter(fakeSerialDataEmitter: FakeSerialDataEmitter) {
    this._fakeSerialDataEmitter = fakeSerialDataEmitter;
  }
}

export interface CommandMap {
  [key: string]: (commandID: number, buffer: Buffer, offset: number) => void;
}
