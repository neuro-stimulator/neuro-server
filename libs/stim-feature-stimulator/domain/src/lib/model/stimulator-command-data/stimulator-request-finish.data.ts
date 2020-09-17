import { SerialDataEvent } from '@stechy1/diplomka-share';

export class StimulatorRequestFinishData implements SerialDataEvent {
  public readonly name = StimulatorRequestFinishData.name;

  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.timestamp = buffer.readUInt32LE(offset++);
  }
}
