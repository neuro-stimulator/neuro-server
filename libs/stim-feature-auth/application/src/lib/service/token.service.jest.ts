import { MockType } from 'test-helpers/test-helpers';

import { TokenService } from './token.service';

export const createTokenServiceMock: () => MockType<TokenService> = jest.fn(() => ({
  createAccessToken: jest.fn(),
  createRefreshToken: jest.fn(),
  validateToken: jest.fn(),
  validatePayload: jest.fn(),
  refreshJWT: jest.fn(),
  deleteRefreshToken: jest.fn(),
  deleteRefreshTokenForUser: jest.fn(),
}));
