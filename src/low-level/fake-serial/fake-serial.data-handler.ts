export interface FakeSerialDataHandler {

  handle(buffer: Buffer): void;
}

export interface FakeSerialDataEmitter {

  emit: (buffer: Buffer) => void;
}
