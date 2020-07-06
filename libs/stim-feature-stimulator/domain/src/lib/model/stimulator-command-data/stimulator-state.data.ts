import { StimulatorStateEvent } from '@stechy1/diplomka-share';

export class StimulatorStateData implements StimulatorStateEvent {
  public readonly name = StimulatorStateData.name;

  public readonly state: number;
  public readonly noUpdate: boolean;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.state = buffer.readUInt8(offset++);
    this.noUpdate = Boolean(buffer.readUInt8(offset++));
    this.timestamp = buffer.readUInt32LE(offset++);
  }
}
