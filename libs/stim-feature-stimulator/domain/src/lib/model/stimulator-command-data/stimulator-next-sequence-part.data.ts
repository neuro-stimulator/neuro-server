import { StimulatorSequencePartRequestEvent } from '@stechy1/diplomka-share';

export class StimulatorNextSequencePartData implements StimulatorSequencePartRequestEvent {
  public readonly name = StimulatorNextSequencePartData.name;
  public readonly offset: number;
  public readonly index: number;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.offset = buffer.readUInt16LE(offset);
    offset += 2;
    this.index = buffer.readUInt8(offset++);
    this.timestamp = buffer.readUInt32LE(offset++);
  }
}
