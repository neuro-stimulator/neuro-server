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
      const userUUID = 'uuid';
      const clientID = 'clientID';
      const refreshToken = 'refreshToken';
      const fromAll = true;

      await facade.logout(userUUID, clientID, refreshToken, fromAll);

      expect(commandBusMock.execute).toBeCalledWith(new LogoutCommand(userUUID, clientID, refreshToken, fromAll));
    });
  });
  describe('refreshJWT()', () => {
    it('positive - should call ', async () => {
      const refreshToken = 'refreshToken';
      const clientId = 'clientId';
      const ipAddress = 'ipAddress';

      await facade.refreshJWT(refreshToken, clientId, ipAddress);

      expect(commandBusMock.execute).toBeCalledWith(new RefreshJwtCommand(refreshToken, clientId, ipAddress));
    });
  });
});
