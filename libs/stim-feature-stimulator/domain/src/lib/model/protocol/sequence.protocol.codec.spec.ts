import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { SequenceProtocolCodec } from './sequence.protocol.codec';

describe('SequenceProtocolCodec', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let testingModule: TestingModule;
  let factory: SequenceProtocolCodec;

  beforeEach( async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequenceProtocolCodec
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    factory = testingModule.get<SequenceProtocolCodec>(SequenceProtocolCodec);
  });

  it('positive - should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('positive - should encode sequence', () => {
    const offset = 0;
    const index = 0;
    const commandID = 1;
    const sequence: Sequence = createEmptySequence();
    sequence.size = 100;
    sequence.data = new Array(sequence.size).fill(0).map(() => Math.round(Math.random() * TOTAL_OUTPUT_COUNT));

    const buffer: Buffer = factory.encodeSequence(sequence, offset, index, commandID);

    expect(buffer).toBeDefined();
  });

});
