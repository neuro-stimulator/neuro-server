import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MessageCodes } from '@stechy1/diplomka-share';

import { UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AuthService } from '../../service/auth.service';
import { createAuthServiceMock } from '../../service/auth.service.jest';
import { LogoutCommand } from '../impl/logout.command';
import { LogoutHandler } from './logout.handler';

describe('LogoutHandler', () => {
  let testingModule: TestingModule;
  let handler: LogoutHandler;
  let service: MockType<AuthService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        LogoutHandler,
        {
          provide: AuthService,
          useFactory: createAuthServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<LogoutHandler>(LogoutHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AuthService>>(AuthService);
  });

  afterEach(() => {
    service.login.mockClear();
  });

  it('positive - should logout user from all devices', async () => {
    const userID = 1;
    const cliendID = 'clientID';
    const refreshToken = 'refreshToken';
    const fromAll = true;
    const command = new LogoutCommand(userID, cliendID, refreshToken, fromAll);

    await handler.execute(command);

    expect(service.logoutFromAll).toBeCalledWith(userID);
  });

  it('positive - should logut user from one device', async () => {
    const userID = 1;
    const cliendID = 'clientID';
    const refreshToken = 'refreshToken';
    const fromAll = false;
    const command = new LogoutCommand(userID, cliendID, refreshToken, fromAll);

    await handler.execute(command);

    expect(service.logout).toBeCalledWith(userID, cliendID, refreshToken);
  });

  it('negative - should throw exception when refresh token not available', async (done: DoneCallback) => {
    const userID = 1;
    const cliendID = 'clientID';
    const refreshToken = undefined;
    const fromAll = false;
    const command = new LogoutCommand(userID, cliendID, refreshToken, fromAll);

    try {
      await handler.execute(command);
      done.fail('UnauthorizedException was not thrown!');
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        expect(e.errorCode).toEqual(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
        done();
      } else {
        done.fail('Unknown exception was thrown!"');
      }
    }
  });
});
