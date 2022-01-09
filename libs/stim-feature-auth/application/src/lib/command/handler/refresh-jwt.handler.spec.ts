import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { LoginResponse, TokenExpiredException, TokenNotFoundException, TokenRefreshFailedException } from '@neuro-server/stim-feature-auth/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { createTokenServiceMock } from '../../service/token.service.jest';
import { TokenService } from '../../service/token.service';
import { RefreshJwtCommand } from '../impl/refresh-jwt.command';
import { RefreshJwtHandler } from './refresh-jwt.handler';

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
    testingModule.useLogger(new NoOpLogger());

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
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const user: User = createEmptyUser();
    user.id = 1;
    const uuid = 'uuid';
    const loginResponse: LoginResponse = {
      refreshToken: 'newRefreshToken',
      accessToken: 'newAccessToken',
      expiresIn: new Date(),
      user,
    };
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockReturnValueOnce([loginResponse, user.id, uuid]);
    queryBus.execute.mockReturnValueOnce(user);

    const result: LoginResponse = await handler.execute(command);

    expect(result).toEqual(loginResponse);
  });

  it('negative - should throw exception when token not found', () => {
    const refreshToken = 'refreshToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new TokenNotFoundException(refreshToken);
    });

    expect(handler.execute(command)).rejects.toThrow(new TokenRefreshFailedException());
  });

  it('negative - should throw exception when JsonWebTokenError occured', () => {
    const refreshToken = 'refreshToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new JsonWebTokenError('Some error');
    });

    expect(handler.execute(command)).rejects.toThrow(new TokenRefreshFailedException());
  });

  it('negative - should throw exception when token expired', () => {
    const refreshToken = 'refreshToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new TokenExpiredError('Some message', new Date());
    });

    expect(handler.execute(command)).rejects.toThrow(new TokenExpiredException());
  });

  it('negative - should throw exception when token not activated', () => {
    const refreshToken = 'refreshToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new NotBeforeError('Some message', new Date());
    });

    expect(handler.execute(command)).rejects.toThrow(new TokenRefreshFailedException());
  });

  it('negative - should throw exception unknown error occured', () => {
    const refreshToken = 'refreshToken';
    const clientId = 'clientId';
    const ipAddress = 'ipAddress';
    const command = new RefreshJwtCommand(refreshToken, clientId, ipAddress);

    service.refreshJWT.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(handler.execute(command)).rejects.toThrow(new TokenRefreshFailedException());
  });
});
