import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { UserIdNotFoundException, UserNotValidException, UserWasNotUpdatedException } from '@diplomka-backend/stim-feature-users/domain';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserWasUpdatedEvent } from '../../event/impl/user-was-updated.event';
import { UserUpdateCommand } from '../impl/user-update.command';
import { UserValidateCommand } from '../impl/user-validate.command';
import { UserUpdateHandler } from './user-update.handler';

describe('UserUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: UserUpdateHandler;
  let service: MockType<UsersService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserUpdateHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
        eventBusProvider,
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<UserUpdateHandler>(UserUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.update.mockClear();
    eventBus.publish.mockClear();
    commandBus.execute.mockClear();
  });

  it('positive - should update user', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.byId.mockReturnValue(user);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new UserValidateCommand(user));
    expect(service.update).toBeCalledWith(user);
    expect(eventBus.publish).toBeCalledWith(new UserWasUpdatedEvent(user));
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new UserIdNotFoundException(user.id);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof UserIdNotFoundException) {
        expect(e.userID).toEqual(user.id);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when user is not valid', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const errors: ValidationErrors = [];
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockImplementation(() => {
      throw new UserNotValidException(user, errors);
    });

    try {
      await handler.execute(command);
      done.fail('UserNotValidException was not thrown!');
    } catch (e) {
      if (e instanceof UserNotValidException) {
        expect(e.user).toEqual(user);
        expect(e.errors).toEqual(errors);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail('UserWasNotUpdatedException was not thrown!');
    } catch (e) {
      if (e instanceof UserWasNotUpdatedException) {
        expect(e.user).toEqual(user);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('UserWasNotUpdatedException was not thrown!');
    } catch (e) {
      if (e instanceof UserWasNotUpdatedException) {
        expect(e.user).toEqual(user);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
