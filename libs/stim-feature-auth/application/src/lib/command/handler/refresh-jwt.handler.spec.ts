import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import { createEmptyUser, MessageCodes, User } from '@stechy1/diplomka-share';

import { LoginResponse, TokenExpiredException, TokenNotFoundException, TokenRefreshFailedException } from '@diplomka-backend/stim-feature-auth/domain';

import { MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { createTokenServiceMock } from '../../service/token.service.jest';
import { TokenService } from '../../service/token.service';
import { RefreshJwtCommand } from '../impl/refresh-jwt.command';
import { RefreshJwtHandler } from './refresh-jwt.handler';
import { QueryBus } from '@nestjs/cqrs';

describe('RefreshJwtHandler', () => {
  let testingModule: TestingModule;
  let handler: RefreshJwtHandler;
  let service: MockType<TokenService>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtHandler,
        {
          provide: TokenService,
          useFactory: createTokenServiceMock,
        },
        queryBusProvider,
      ],
    }).compile();

    handler = testingModule.get<RefreshJwtHandler>(RefreshJwtHandler);
    // @ts-ignore
    service = testingModule.get<MockType<TokenService>>(TokenService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    service.refreshJWT.mockClear();
    queryBus.execute.mockClear();
  });

  it('positive - should refresh JWT token', async () => {
    const refreshToken = 'refreshToken';
    const oldAccessToken = 'oldAccessToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const user: User = createEmptyUser();
    user.id = 1;
    const loginResponse: LoginResponse = {
      refreshToken: 'newRefreshToken',
      accessToken: 'newAccessToken',
      expiresIn: new Date(),
      user,
    };
    const command = new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress);

    service.refreshJWT.mockReturnValueOnce([loginResponse, user.id]);
    queryBus.execute.mockReturnValueOnce(user);

    const result: LoginResponse = await handler.execute(command);

    expect(result).toEqual(loginResponse);
  });

  it('negative - should throw exception when token not found', async (done: DoneCallback) => {
    const refreshToken = 'refreshToken';
    const oldAccessToken = 'oldAccessToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new TokenNotFoundException();
    });

    try {
      await handler.execute(command);
      done.fail('TokenRefreshFailedException was not thrown!');
    } catch (e) {
      if (e instanceof TokenRefreshFailedException) {
        expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when JsonWebTokenError occured', async (done: DoneCallback) => {
    const refreshToken = 'refreshToken';
    const oldAccessToken = 'oldAccessToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new JsonWebTokenError('Some error');
    });

    try {
      await handler.execute(command);
      done.fail('TokenRefreshFailedException was not thrown!');
    } catch (e) {
      if (e instanceof TokenRefreshFailedException) {
        expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when token expired', async (done: DoneCallback) => {
    const refreshToken = 'refreshToken';
    const oldAccessToken = 'oldAccessToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new TokenExpiredError('Some message', new Date());
    });

    try {
      await handler.execute(command);
      done.fail('TokenExpiredException was not thrown!');
    } catch (e) {
      if (e instanceof TokenExpiredException) {
        expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when token not activated', async (done: DoneCallback) => {
    const refreshToken = 'refreshToken';
    const oldAccessToken = 'oldAccessToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new NotBeforeError('Some message', new Date());
    });

    try {
      await handler.execute(command);
      done.fail('TokenRefreshFailedException was not thrown!');
    } catch (e) {
      if (e instanceof TokenRefreshFailedException) {
        expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
