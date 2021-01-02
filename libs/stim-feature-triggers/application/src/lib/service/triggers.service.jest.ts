import { MockType } from 'test-helpers/test-helpers';

import { TriggersService } from './triggers.service';

export const createTriggersServiceMock: () => MockType<TriggersService> = jest.fn(() => ({
  initializeTriggers: jest.fn(),
  enable: jest.fn(),
  enableAll: jest.fn(),
  disable: jest.fn(),
  disableAll: jest.fn(),
}));
