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
    const cmd = buffer.readUInt8(offset++);
    // setTimeout(() => {
      this.commandMap[cmd](buffer, offset);
    // }, 500);
  }

  public registerFakeDataEmitter(fakeSerialDataEmitter: FakeSerialDataEmitter) {
    this._fakeSerialDataEmitter = fakeSerialDataEmitter;
  }

}

export interface CommandMap {
  [key: string]: (buffer: Buffer, offset: number) => void;
}
