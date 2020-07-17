import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { RegisterUserCommand } from '@diplomka-backend/stim-feature-users/application';
import { UserNotValidException, UserWasNotRegistredException } from '@diplomka-backend/stim-feature-users/domain';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { RegisterUserHandler } from './register-user.handler';

describe('RegisterUserHandler', () => {
  let testingModule: TestingModule;
  let handler: RegisterUserHandler;
  let service: MockType<UsersService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<RegisterUserHandler>(RegisterUserHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should register new user', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const valid = true;
    const command = new RegisterUserCommand(user);

    commandBus.execute.mockReturnValueOnce(valid);
    service.hashPassword.mockReturnValue('hash');
    commandBus.execute.mockReturnValueOnce(user.id);

    const userID: number = await handler.execute(command);

    expect(userID).toEqual(user.id);
  });

  it('negative - should throw exception when user is not valid', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    const errors: ValidationErrors = [];
    const command = new RegisterUserCommand(user);

    commandBus.execute.mockImplementationOnce(() => {
      throw new UserNotValidException(user, errors);
    });

    try {
      await handler.execute(command);
      done.fail('UserNotValidException was not thrown!');
    } catch (e) {
      if (e instanceof UserNotValidException) {
        expect(e.user).toEqual(user);
        done();
      } else {
        done.fail('Unknown exceptio was thrown!');
      }
    }
  });

  it('negative - should throw exception when user is not created', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    const valid = true;
    const command = new RegisterUserCommand(user);

    commandBus.execute.mockReturnValueOnce(valid);
    commandBus.execute.mockImplementationOnce(() => {
      throw new UserWasNotRegistredException(user);
    });

    try {
      await handler.execute(command);
      done.fail('UserWasNotRegistredException was not thrown!');
    } catch (e) {
      if (e instanceof UserWasNotRegistredException) {
        expect(e.user).toBeDefined();
        done();
      } else {
        done.fail('Unknown exceptio was thrown!');
      }
    }
  });

  it('negative - should throw exception when user is not created', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    const valid = true;
    const command = new RegisterUserCommand(user);

    commandBus.execute.mockReturnValueOnce(valid);
    commandBus.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('UserWasNotRegistredException was not thrown!');
    } catch (e) {
      if (e instanceof UserWasNotRegistredException) {
        expect(e.user).toBeDefined();
        done();
      } else {
        done.fail('Unknown exceptio was thrown!');
      }
    }
  });
});
