import { StimulatorProtocol } from '@neuro-server/stim-feature-stimulator/domain';

import { MockType } from 'test-helpers/test-helpers';

export const createStimulatorProtocolMock: () => MockType<StimulatorProtocol> = jest.fn(() => ({
  bufferCommandDISPLAY_CLEAR: jest.fn(),
  bufferCommandDISPLAY_PRINT: jest.fn(),
  bufferCommandDISPLAY_PRINT_LINE: jest.fn(),
  bufferCommandSTIMULATOR_STATE: jest.fn(),
  bufferCommandMANAGE_EXPERIMENT: jest.fn(),
  bufferCommandEXPERIMENT_UPLOAD: jest.fn(),
  bufferCommandNEXT_SEQUENCE_PART: jest.fn(),
  bufferCommandBACKDOOR_1: jest.fn(),
  bufferMemory: jest.fn(),
}));
