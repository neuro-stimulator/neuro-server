import { StimulatorMemoryEvent } from '@stechy1/diplomka-share';

export class StimulatorMemoryData implements StimulatorMemoryEvent {
  public readonly name = StimulatorMemoryData.name;
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
