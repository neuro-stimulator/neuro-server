import { Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, MessageCodes, ResponseObject, User } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { LoginFailedException, LoginResponse, TokenRefreshFailedException, UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AuthFacade } from '../service/auth.facade';
import { createAuthFacadeMock } from '../service/auth.facade.jest';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let testingModule: TestingModule;
  let controller: AuthController;
  let facade: MockType<AuthFacade>;
  let responseMock: MockType<Partial<Response>>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthFacade,
          useFactory: createAuthFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<AuthController>(AuthController);
    // @ts-ignore
    facade = testingModule.get<MockType<AuthFacade>>(AuthFacade);
    responseMock = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      end: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('positive - should login user and send back user informations', async () => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';
      const loginResponse: LoginResponse = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user,
        expiresIn: new Date(),
      };

      facade.login.mockReturnValueOnce(loginResponse);

      // @ts-ignore
      const response: ResponseObject<User> = await controller.login(ipAddress, user, clientID, responseMock);

      expect(responseMock.cookie.mock.calls[0]).toEqual([
        'SESSIONID',
        loginResponse.accessToken,
        { httpOnly: true, secure: false, sameSite: 'strict', expires: loginResponse.expiresIn },
      ]);
      expect(responseMock.cookie.mock.calls[1]).toEqual(['XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' }]);
      expect(response.data).toBeDefined();
      expect(response.data).toEqual(loginResponse.user);
      // expect(responseMock.json).toBeCalledWith({ data: loginResponse.user });
    });

    it('negative - should not login invalid user', () => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      // @ts-ignore
      expect(() => controller.login(ipAddress, user, clientID, responseMock)).rejects.toThrow(new UnauthorizedException());
    });

    it('negative - should not login user because login failed', () => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new LoginFailedException();
      });

      // @ts-ignore
      expect(() => controller.login(ipAddress, user, clientID, responseMock)).rejects.toThrow(new UnauthorizedException());
    });

    it('negative - should not login when unexpected error occured', () => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new Error();
      });

      // @ts-ignore
      const rejection = expect(() => controller.login(ipAddress, user, clientID, responseMock)).rejects;

      return Promise.all([
        rejection.toBeInstanceOf(ControllerException),
        rejection.toHaveProperty('errorCode', MessageCodes.CODE_ERROR)
      ]);
    });
  });

  describe('refreshJWT()', () => {
    it('positive - should refresh JWT with refresh token', async () => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const refreshToken = 'refreshToken';
      const tokenRefreshed = false;
      const user: User = createEmptyUser();
      const loginResponse: LoginResponse = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: new Date(),
        user,
      };

      facade.refreshJWT.mockReturnValueOnce(loginResponse);

      // @ts-ignore
      const response: ResponseObject<User> = await controller.refreshJWT(ipAddress, clientID, refreshToken, tokenRefreshed, responseMock, user);

      expect(responseMock.cookie.mock.calls[0]).toEqual([
        'SESSIONID',
        loginResponse.accessToken,
        { httpOnly: true, secure: false, sameSite: 'strict', expires: loginResponse.expiresIn },
      ]);
      expect(responseMock.cookie.mock.calls[1]).toEqual(['XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' }]);

      expect(response.data).toBeDefined();
      expect(response.data).toEqual(loginResponse.user);
    });

    it('positive - should not refresh token when it was already refreshed', async () => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const refreshToken = 'refreshToken';
      const tokenRefreshed = true;
      const user: User = createEmptyUser();
      const loginResponse: LoginResponse = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: new Date(),
        user,
      };

      // @ts-ignore
      const response: ResponseObject<User> = await controller.refreshJWT(ipAddress, clientID, refreshToken, tokenRefreshed, responseMock, user);

      expect(responseMock.cookie.mock.calls).toHaveLength(0);

      expect(response.data).toBeDefined();
      expect(response.data).toEqual(loginResponse.user);
    });

    it('negative - should not refresh JWT when the process failed', () => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const refreshToken = 'refreshToken';
      const tokenRefreshed = false;
      const user: User = createEmptyUser();

      facade.refreshJWT.mockImplementationOnce(() => {
        throw new TokenRefreshFailedException();
      });

      // @ts-ignore
      expect(() => controller.refreshJWT(ipAddress, clientID, refreshToken, tokenRefreshed, responseMock, user))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_AUTH_TOKEN_REFRESH_FAILED))
    });

    it('negative - should not refresh JWN when unexpected error occured', () => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const refreshToken = 'refreshToken';
      const tokenRefreshed = false;
      const user: User = createEmptyUser();

      facade.refreshJWT.mockImplementationOnce(() => {
        throw new Error();
      });

      // @ts-ignore
      expect(() => controller.refreshJWT(ipAddress, clientID, refreshToken, tokenRefreshed, responseMock, user))
      .rejects.toThrow(new ControllerException())
    });
  });

  describe('logout()', () => {
    it('positive - should logout user', async () => {
      const userData: { id: number } = { id: 1 };
      const refreshToken =  'refreshToken'
      const clientID = 'clientID';
      const fromAll = true; // Nyní na hodnotě nezálezí

      // @ts-ignore
      await controller.logout(userData, refreshToken, clientID, responseMock, fromAll);

      expect(responseMock.clearCookie.mock.calls[0]).toEqual(['SESSIONID']);
      expect(responseMock.clearCookie.mock.calls[1]).toEqual(['XSRF-TOKEN']);
      expect(responseMock.end).toBeCalled();
    });

    it('negative - should not logout user from one device when token missing', () => {
      const userData: { id: number } = { id: 1 };
      const refreshToken =  'refreshToken'
      const clientID = 'clientID';
      const fromAll = true; // Nyní na hodnotě nezálezí

      facade.logout.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      // @ts-ignore
      expect(() => controller.logout(userData, refreshToken, clientID, responseMock, fromAll))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED));
    });

    it('negative - should not logout user when unexpected error occurec', () => {
      const userData: { id: number } = { id: 1 };
      const refreshToken =  'refreshToken'
      const clientID = 'clientID';
      const fromAll = true; // Nyní na hodnotě nezálezí

      facade.logout.mockImplementationOnce(() => {
        throw new Error();
      });

      // @ts-ignore
      expect(() => controller.logout(userData, refreshToken, clientID, responseMock, fromAll)).rejects.toThrow(new ControllerException());
    });
  });
});
