import { MockType } from 'test-helpers/test-helpers';
import { AuthFacade } from './auth.facade';

export const createAuthFacadeMock: () => MockType<AuthFacade> = jest.fn(() => ({
  login: jest.fn(),
  logout: jest.fn(),
  refreshJWT: jest.fn(),
}));
