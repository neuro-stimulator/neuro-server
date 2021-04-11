import { IOEvent } from '@stechy1/diplomka-share';

export class StimulatorIoChangeData implements IOEvent {
  public readonly name = StimulatorIoChangeData.name;

  public readonly ioType: 'input' | 'output';
  public readonly state: 'on' | 'off';
  public readonly index: number;
  public readonly timestamp: number;

  constructor(ioType: 'input' | 'output', state: 'on' | 'off', buffer: Buffer, offset: number) {
    this.ioType = ioType;
    this.state = state;
    this.index = buffer.readUInt8(offset++);
    this.timestamp = buffer.readUInt32LE(offset++);
  }

  public toString(): string {
    return `ioType: ${this.ioType}; state: ${this.state}; index: ${this.index}; timestamp: ${this.timestamp}`;
  }
}
