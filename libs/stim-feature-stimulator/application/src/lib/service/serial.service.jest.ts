import { MockType } from 'test-helpers/test-helpers';

import { SerialService } from './serial.service';

export const createSerialServiceMock: () => MockType<SerialService> = jest.fn(() => ({
  discover: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  write: jest.fn(),
  isConnected: jest.fn(),
}));
