import { Response } from 'express';
import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, MessageCodes, User } from '@stechy1/diplomka-share';

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
      await controller.login(ipAddress, user, clientID, responseMock);

      expect(responseMock.cookie.mock.calls[0]).toEqual([
        'SESSIONID',
        loginResponse.accessToken,
        { httpOnly: true, secure: false, sameSite: 'strict', expires: loginResponse.expiresIn },
      ]);
      expect(responseMock.cookie.mock.calls[1]).toEqual(['XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' }]);
      expect(responseMock.json).toBeCalledWith({ data: loginResponse.user });
    });

    it('negative - should not login invalid user', async (done: DoneCallback) => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        // @ts-ignore
        await controller.login(ipAddress, user, clientID, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not login user because login failed', async (done: DoneCallback) => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new LoginFailedException();
      });

      try {
        // @ts-ignore
        await controller.login(ipAddress, user, clientID, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_AUTH_LOGIN_FAILED);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not login when unexpected error occured', async (done: DoneCallback) => {
      const ipAddress = 'ipAddress';
      const user: User = createEmptyUser();
      const clientID = 'clientID';

      facade.login.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        // @ts-ignore
        await controller.login(ipAddress, user, clientID, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('refreshJWT()', () => {
    it('positive - should refresh JWT with refresh token', async () => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const user: User = createEmptyUser();
      const userData: { id: number; refreshToken: string } = { id: 1, refreshToken: 'oldRefreshToken' };
      const loginResponse: LoginResponse = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresIn: new Date(),
        user,
      };

      facade.refreshJWT.mockReturnValueOnce(loginResponse);

      // @ts-ignore
      await controller.refreshJWT(ipAddress, clientID, userData, responseMock);

      expect(responseMock.cookie.mock.calls[0]).toEqual([
        'SESSIONID',
        loginResponse.accessToken,
        { httpOnly: true, secure: false, sameSite: 'strict', expires: loginResponse.expiresIn },
      ]);
      expect(responseMock.cookie.mock.calls[1]).toEqual(['XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' }]);

      expect(responseMock.json).toBeCalledWith({ data: loginResponse.user });
    });

    it('negative - should not refresh JWT when the process failed', async (done: DoneCallback) => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const userData: { id: number; refreshToken: string } = { id: 1, refreshToken: 'oldRefreshToken' };
      const oldJWT = 'jwt';

      facade.refreshJWT.mockImplementationOnce(() => {
        throw new TokenRefreshFailedException();
      });

      try {
        // @ts-ignore
        await controller.refreshJWT(ipAddress, clientID, userData, oldJWT, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_AUTH_TOKEN_REFRESH_FAILED);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });



    it('negative - should not refresh JWN when unexpected error occured', async (done: DoneCallback) => {
      const ipAddress = 'ipAddress';
      const clientID = 'clientID';
      const userData: { id: number; refreshToken: string } = { id: 1, refreshToken: 'oldRefreshToken' };
      const oldJWT = 'jwt';

      facade.refreshJWT.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        // @ts-ignore
        await controller.refreshJWT(ipAddress, clientID, userData, oldJWT, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('logout()', () => {
    it('positive - should logout user', async () => {
      const userData: { id: number } = { id: 1 };
      const refreshToken =  'refreshToken'
      const fromAll = true; // Nyní na hodnotě nezálezí

      // @ts-ignore
      await controller.logout(userData, refreshToken, fromAll, responseMock);

      expect(responseMock.clearCookie.mock.calls[0]).toEqual(['SESSIONID']);
      expect(responseMock.clearCookie.mock.calls[1]).toEqual(['XSRF-TOKEN']);
      expect(responseMock.end).toBeCalled();
    });

    it('negative - should not logout user from one device when token missing', async (done: DoneCallback) => {
      const userData: { id: number; refreshToken: string } = { id: 1, refreshToken: 'refreshToken' };
      const fromAll = true; // Nyní na hodnotě nezálezí

      facade.logout.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      try {
        // @ts-ignore
        await controller.logout(userData, fromAll, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not logout user when unexpected error occurec', async (done: DoneCallback) => {
      const userData: { id: number; refreshToken: string } = { id: 1, refreshToken: 'refreshToken' };
      const fromAll = true; // Nyní na hodnotě nezálezí

      facade.logout.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        // @ts-ignore
        await controller.logout(userData, fromAll, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
