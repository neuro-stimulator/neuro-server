import { MockType } from 'test-helpers/test-helpers';

import { AuthService } from './auth.service';

export const createAuthServiceMock: () => MockType<AuthService> = jest.fn(() => ({
  login: jest.fn(),
  logout: jest.fn(),
  logoutFromAll: jest.fn(),
}));
