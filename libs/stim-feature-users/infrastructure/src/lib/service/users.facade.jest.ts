import { MockType } from 'test-helpers/test-helpers';

import { UsersFacade } from './users.facade';

export const createUsersFacadeMock: () => MockType<UsersFacade> = jest.fn(() => ({
  userById: jest.fn(),
  register: jest.fn(),
  update: jest.fn(),
}));
