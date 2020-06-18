import {
  IOEvent,
  StimulatorMemoryEvent,
  StimulatorSequencePartRequestEvent,
  StimulatorStateEvent
} from '@stechy1/diplomka-share';

export class EventIOChange implements IOEvent {

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

export class EventStimulatorState implements StimulatorStateEvent {

  public readonly name = EventStimulatorState.name;

  public readonly state: number;
  public readonly noUpdate: boolean;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.state = buffer.readUInt8(offset++);
    this.noUpdate = Boolean(buffer.readUInt8(offset++));
    this.timestamp = buffer.readUInt32LE(offset++);
  }

}

export class EventMemory implements StimulatorMemoryEvent {

  public readonly name = EventMemory.name;
  public readonly data: string[] = [];

  constructor(buffer: Buffer, offset: number) {
    const it = buffer.values();
    for (let i = 0; i < offset; i++) {
      it.next();
    }
    let result = it.next();
    while (!result.done) {
      this.data.push(result.value);
      result = it.next();
    }
  }

}

export class EventNextSequencePart implements StimulatorSequencePartRequestEvent {

  public readonly name = EventNextSequencePart.name;
  public readonly offset: number;
  public readonly index: number;
  public readonly timestamp: number;

  constructor(buffer: Buffer, offset: number) {
    this.offset = buffer.readUInt16LE(offset); offset += 2;
    this.index = buffer.readUInt8(offset++);
    this.timestamp = buffer.readUInt32LE(offset++);
  }

}
