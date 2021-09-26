import DoneCallback = jest.DoneCallback;

import { CommandToStimulator, createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceProtocol } from './sequence.protocol';

describe('Sequence protocol', () => {

  const TOTAL_OUTPUT_COUNT = 8;
  const index = 1;

  let sequence: Sequence;
  let sequenceProtocol: SequenceProtocol;

  beforeEach(() => {
    sequence = createEmptySequence();
    sequenceProtocol = new SequenceProtocol(sequence);
  })

  it('positive - should encode sequence', (done: DoneCallback) => {
    const commandID = 0;
    sequence.size = 100;
    sequence.data = new Array(sequence.size).fill(0).map(() => Math.round(Math.random() * TOTAL_OUTPUT_COUNT));
    const offset = 0;
    const command = sequenceProtocol.encodeSequence(offset, index, commandID);
    let bufferOffset = 0;

    try {
      expect(command.readUInt8(bufferOffset++)).toBe(commandID);
      expect(command.readUInt8(bufferOffset++)).toBe(CommandToStimulator.COMMAND_SEQUENCE_NEXT_PART);
      expect(command.readUInt8(bufferOffset++)).toBe(index);

      const data = command.readUInt32LE(bufferOffset);
      bufferOffset += 4;
      const buffer: number[] = sequence.data.slice(offset, Math.min(offset + 8, sequence.data.length));

      for (let i = 0; i < buffer.length; i++) {
        expect(buffer[i]).toBe((data >> (4 * i)) & 0xf);
      }

      expect(command.readUInt8(bufferOffset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
      expect(bufferOffset).toEqual(8);
    } catch (error) {
      done({ message: `Offset: ${offset} - ${error}` });
      return;
    }

    done();

  })

});
