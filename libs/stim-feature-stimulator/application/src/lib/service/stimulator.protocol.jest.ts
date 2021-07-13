import { MockType } from 'test-helpers/test-helpers';

import { StimulatorProtocol } from '@diplomka-backend/stim-feature-stimulator/domain';

export const createStimulatorProtocolMock: () => MockType<StimulatorProtocol> = jest.fn(() => ({
  bufferCommandDISPLAY_CLEAR: jest.fn(),
  bufferCommandDISPLAY_SET: jest.fn(),
  bufferCommandSTIMULATOR_STATE: jest.fn(),
  bufferCommandMANAGE_EXPERIMENT: jest.fn(),
  bufferCommandEXPERIMENT_UPLOAD: jest.fn(),
  bufferCommandNEXT_SEQUENCE_PART: jest.fn(),
  bufferCommandBACKDOOR_1: jest.fn(),
  bufferMemory: jest.fn(),
}));
