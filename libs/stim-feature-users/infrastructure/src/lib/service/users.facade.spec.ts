import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { RegisterUserCommand, UserByIdQuery, UserUpdateCommand } from '@neuro-server/stim-feature-users/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { UsersFacade } from './users.facade';

describe('UsersFacade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: UsersFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [UsersFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    facade = testingModule.get<UsersFacade>(UsersFacade);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
    queryBusMock.execute.mockClear();
  });

  describe('userById()', () => {
    it('positive - should call', async () => {
      const userID = 1;

      await facade.userById(userID);

      expect(queryBusMock.execute).toBeCalledWith(new UserByIdQuery(userID));
    });
  });

  describe('register()', () => {
    it('positive - should call', async () => {
      const user: User = createEmptyUser();

      await facade.register(user);

      expect(commandBusMock.execute).toBeCalledWith(new RegisterUserCommand(user));
    });
  });

  describe('update()', () => {
    it('positive - should call', async () => {
      const user: User = createEmptyUser();

      await facade.update(user);

      expect(commandBusMock.execute).toBeCalledWith(new UserUpdateCommand(user));
    });
  });
});
