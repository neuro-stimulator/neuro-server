export interface HwEvent {
  name: string;
}

export class EventIOChange implements HwEvent {

  public readonly name = EventIOChange.name;

  public readonly ioType: 'input' | 'output';
  public readonly state: 'on' | 'off';
  public readonly index: number;
  public readonly timestamp: number;

  constructor(ioType: 'input' | 'output', state: 'on' | 'off',
              buffer: Buffer, offset: number) {
    this.ioType = ioType;
    this.state = state;
    this.index = buffer.readUInt8(offset++);
    this.timestamp = buffer.readUInt32LE(offset++);
  }

}

export class EventStimulatorState implements HwEvent {

  public readonly name = EventStimulatorState.name;

  public readonly state: number;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.state = buffer.readUInt8(offset++);
    this.timestamp = buffer.readUInt32LE(offset++);
  }

}

export class EventDebug implements HwEvent {

  public readonly name = EventDebug.name;
  public readonly data: string[] = [];

  constructor(buffer: Buffer, offset: number) {
    const it = buffer.values();
    let result = it.next();
    while (!result.done) {
      this.data.push(result.value);
      result = it.next();
    }
  }

}
