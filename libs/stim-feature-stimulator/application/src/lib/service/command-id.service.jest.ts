import { MockType } from 'test-helpers/test-helpers';

import { CommandIdService } from './command-id.service';

export const createCommandIdServiceMock: () => MockType<CommandIdService> = jest.fn(() => ({
  firstValue: jest.fn(),
  maxValue: jest.fn(),
  counter: jest.fn(),
}));
