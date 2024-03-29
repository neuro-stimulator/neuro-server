import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@stechy1/diplomka-share';

import { LoginResponse } from '@neuro-server/stim-feature-auth/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { createTokenServiceMock } from './token.service.jest';

describe('AuthService', () => {
  let testingModule: TestingModule;
  let service: AuthService;
  let tokenService: MockType<TokenService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useFactory: createTokenServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<AuthService>(AuthService);
    // @ts-ignore
    tokenService = testingModule.get<MockType<TokenService>>(TokenService);
  });

  it('positive - should be definde', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    it('positive - should login user', async () => {
      const clientId = 'client id';
      const ipAddress = 'ip address';
      const accessToken = 'access token';
      const refreshToken = 'refresh token';

      const user: User = {
        id: 1,
        acl: []
      };
      const loginResponse: LoginResponse = {
        expiresIn: new Date(),
        accessToken
      };
      tokenService.createAccessToken.mockReturnValueOnce(loginResponse);
      tokenService.createRefreshToken.mockReturnValueOnce(refreshToken);

      const loginResp = await service.login(user, ipAddress, clientId);

      expect(loginResp).toEqual(expect.objectContaining({
        expiresIn: loginResponse.expiresIn,
        accessToken: loginResponse.accessToken,
        refreshToken: refreshToken
      } as LoginResponse));
    });

  });

  describe('logout()', () => {
    it('positive - should logout from one device', async () => {
      const userUUID = 'uuid';
      const refreshToken = 'refresh token';
      const clientID = 'clientID';
      await service.logout(userUUID, clientID, refreshToken);

      expect(tokenService.deleteRefreshToken).toBeCalledWith(userUUID, clientID, refreshToken);
    });
  });

  describe('logoutFromAll()', () => {
    it('positive - should logout from all devices', async () => {
      const userUUID = 'uuid';
      await service.logoutFromAll(userUUID);

      expect(tokenService.deleteRefreshTokenForUser).toBeCalledWith(userUUID);
    });
  });


});
