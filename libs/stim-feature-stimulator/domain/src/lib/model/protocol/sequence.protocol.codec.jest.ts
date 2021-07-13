import { MockType } from 'test-helpers/test-helpers';

import { SequenceProtocolCodec } from './sequence.protocol.codec';

export const createSequenceProtocolCodecMock: () => MockType<SequenceProtocolCodec> = jest.fn(() => ({
  encodeSequence: jest.fn(),
  decodeSequence: jest.fn()
}));
