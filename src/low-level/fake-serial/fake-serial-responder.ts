import { FakeSerialDataEmitter, FakeSerialDataHandler } from './fake-serial.data-handler';
import { Logger } from '@nestjs/common';

export abstract class FakeSerialResponder implements FakeSerialDataHandler {

  protected readonly logger: Logger = new Logger(FakeSerialResponder.name);

  private _fakeSerialDataEmitter: FakeSerialDataEmitter;

  protected abstract get commandMap(): CommandMap;

  protected emitData(buffer: Buffer): void {
    this._fakeSerialDataEmitter.emit(buffer);
  }

  public handle(buffer: Buffer): void {
    this.logger.debug('Handluju data...');
    let offset = 0;
    const cmd = buffer.readUInt8(offset++);
    this.commandMap[cmd](buffer, offset);
  }

  public registerFakeDataEmitter(fakeSerialDataEmitter: FakeSerialDataEmitter) {
    this._fakeSerialDataEmitter = fakeSerialDataEmitter;
  }

}

export interface CommandMap {
  [key: string]: (buffer: Buffer, offset: number) => void;
}
