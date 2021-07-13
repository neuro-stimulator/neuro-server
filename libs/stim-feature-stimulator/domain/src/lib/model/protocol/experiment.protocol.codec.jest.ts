import { MockType } from 'test-helpers/test-helpers';

import { ExperimentProtocolCodec } from './experiment.protocol.codec';

export const createExperimentProtocolCodecMock: () => MockType<ExperimentProtocolCodec> = jest.fn(() => ({
  encodeExperiment: jest.fn(),
  decodeExperiment: jest.fn()
}));
