import { MockType } from 'test-helpers/test-helpers';

import { SerialFacade } from './serial.facade';

export const createSerialFacadeMock: () => MockType<SerialFacade> = jest.fn(() => ({
  discover: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  status: jest.fn(),
}));
