import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { createEmptyUser, MessageCodes, User } from '@stechy1/diplomka-share';

import { LoginFailedException, LoginResponse } from '@diplomka-backend/stim-feature-auth/domain';
import { UserNotFoundException } from '@diplomka-backend/stim-feature-users/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { createAuthServiceMock } from '../../service/auth.service.jest';
import { AuthService } from '../../service/auth.service';
import { LoginCommand } from '../impl/login.command';
import { LoginHandler } from './login.handler';

describe('LoginHandler', () => {
  let testingModule: TestingModule;
  let handler: LoginHandler;
  let service: MockType<AuthService>;
  let queryBusMock: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: AuthService,
          useFactory: createAuthServiceMock,
        },
        queryBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<LoginHandler>(LoginHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AuthService>>(AuthService);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    service.login.mockClear();
    queryBusMock.execute.mockClear();
  });

  it('positive - should login user', async () => {
    const userCredentials: User = {
      email: 'email',
      password: 'password',
    };
    const ipAddress = 'ipAddress';
    const clientId = 'clientId';
    const userByEmail: User = createEmptyUser();
    const loginResponse: LoginResponse = {
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
      expiresIn: new Date(),
      user: userByEmail
    };
    const loginResponseWithUser: LoginResponse = { ...loginResponse, user: userByEmail };
    const command = new LoginCommand(userCredentials, ipAddress, clientId);

    queryBusMock.execute.mockReturnValueOnce(userByEmail);
    service.login.mockReturnValueOnce(loginResponse);

    const result: LoginResponse = await handler.execute(command);

    expect(result).toEqual(loginResponseWithUser);
  });

  it('negative - throw exception when user not found', () => {
    const userCredentials: User = {
      email: 'email',
      password: 'password',
    };
    const ipAddress = 'ipAddress';
    const clientId = 'clientId';
    const command = new LoginCommand(userCredentials, ipAddress, clientId);

    queryBusMock.execute.mockImplementationOnce(() => {
      throw new UserNotFoundException();
    });

    expect(handler.execute(command)).rejects.toThrow(new LoginFailedException(MessageCodes.CODE_ERROR_USER_NOT_FOUND));
  });

  it('negative - should throw exception unknown error occured', () => {
    const userCredentials: User = {
      email: 'email',
      password: 'password',
    };
    const ipAddress = 'ipAddress';
    const clientId = 'clientId';
    const command = new LoginCommand(userCredentials, ipAddress, clientId);

    queryBusMock.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(handler.execute(command)).rejects.toThrow(new LoginFailedException());
  });
});
