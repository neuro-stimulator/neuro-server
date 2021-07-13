import { CommandToStimulator, Sequence } from '@stechy1/diplomka-share';

import { SerializedSequence } from '../interfaces';

export class SequenceProtocol {

  protected serializedSequence: SerializedSequence;

  constructor(protected readonly sequence?: Sequence) {}

  public encodeSequence(offset: number, index: number, commandID: number): Buffer {
    this.initializeEncoder();

    this.writeHeader(commandID, index);
    this.writeSequenceBody(offset);
    this.writeTail();

    return this.serializeSequence();
  }

  protected initializeEncoder(): void {
    this.serializedSequence = {
      offset: 0,
      sequence: Buffer.alloc(256, 0),
    };
  }

  protected writeHeader(commandID: number, index: number): void {
    this.serializedSequence.sequence.writeUInt8(commandID, this.serializedSequence.offset++);
    this.serializedSequence.sequence.writeUInt8(CommandToStimulator.COMMAND_SEQUENCE_NEXT_PART, this.serializedSequence.offset++);
    this.serializedSequence.sequence.writeUInt8(index, this.serializedSequence.offset++);
  }

  protected writeSequenceBody(offset: number): void {
    const buffer: number[] = this.sequence.data.slice(offset, Math.min(offset + 8, this.sequence.data.length));
    // Jednoduché zarovnání na sudý počet čísel
    if (buffer.length % 2 !== 0) {
      buffer.push(0);
    }

    let int32 = 0;
    for (let i = buffer.length - 1; i >= 0; i--) {
      int32 |= buffer[i] << (4 * i);
    }
    if (int32 < 0) {
      this.serializedSequence.sequence.writeInt32LE(int32, this.serializedSequence.offset);
    } else {
      this.serializedSequence.sequence.writeUInt32LE(int32, this.serializedSequence.offset);
    }
    this.serializedSequence.offset += 4;
  }

  protected writeTail(): void {
    // Nakonec přidám oddělovací znak
    this.serializedSequence.sequence.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, this.serializedSequence.offset++);
  }

  protected serializeSequence(): Buffer {
    return this.serializedSequence.sequence.slice(0, this.serializedSequence.offset);
  }
}
