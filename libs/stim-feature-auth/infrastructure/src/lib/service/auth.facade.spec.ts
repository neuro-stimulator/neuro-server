import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '@stechy1/diplomka-share';

import { LoginCommand, LogoutCommand, RefreshJwtCommand } from '@diplomka-backend/stim-feature-auth/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let testingModule: TestingModule;
  let facade: AuthFacade;
  let commandBusMock: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AuthFacade, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AuthFacade>(AuthFacade);
    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
  });

  describe('login()', () => {
    it('positive - should call ', async () => {
      const user: User = { username: 'username', email: 'email', lastLoginDate: Date.now() };
      const ipAddress = '';
      const clientId = '';

      await facade.login(user, ipAddress, clientId);

      expect(commandBusMock.execute).toBeCalledWith(new LoginCommand(user, ipAddress, clientId));
    });
  });
  describe('logout()', () => {
    it('positive - should call ', async () => {
      const userID = 1;
      const refreshToken = 'refreshToken';
      const fromAll = true;

      await facade.logout(userID, refreshToken, fromAll);

      expect(commandBusMock.execute).toBeCalledWith(new LogoutCommand(userID, refreshToken, fromAll));
    });
  });
  describe('refreshJWT()', () => {
    it('positive - should call ', async () => {
      const refreshToken = 'refreshToken';
      const oldAccessToken = 'oldAccessToken';
      const clientId = 'clientId';
      const ipAddress = 'ipAddress';

      await facade.refreshJWT(refreshToken, oldAccessToken, clientId, ipAddress);

      expect(commandBusMock.execute).toBeCalledWith(new RefreshJwtCommand(refreshToken, oldAccessToken, clientId, ipAddress));
    });
  });
});
