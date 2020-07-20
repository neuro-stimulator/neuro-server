import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';
import { UserNotValidException, UserWasNotCreatedException } from '@diplomka-backend/stim-feature-users/domain';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserWasCreatedEvent } from '../../event/impl/user-was-created.event';
import { UserInsertCommand } from '../impl/user-insert.command';
import { UserInsertHandler } from './user-insert.handler';
import { ValidationErrors } from '@diplomka-backend/stim-lib-common';

describe('UserInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: UserInsertHandler;
  let service: MockType<UsersService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserInsertHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<UserInsertHandler>(UserInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.insert.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should insert user', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserInsertCommand(user);

    service.insert.mockReturnValue(user.id);

    const result = await handler.execute(command);

    expect(result).toEqual(user.id);
    expect(service.insert).toBeCalledWith(user);
    expect(eventBus.publish).toBeCalledWith(new UserWasCreatedEvent(user.id));
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserInsertCommand(user);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserWasNotCreatedException was not thrown' });
    } catch (e) {
      if (e instanceof UserWasNotCreatedException) {
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const errors: ValidationErrors = [];
    const command = new UserInsertCommand(user);

    service.insert.mockImplementation(() => {
      throw new UserNotValidException(user, errors);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserNotValidException was not thrown' });
    } catch (e) {
      if (e instanceof UserNotValidException) {
        expect(e.errors).toEqual(errors);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserInsertCommand(user);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserWasNotCreatedException was not thrown' });
    } catch (e) {
      if (e instanceof UserWasNotCreatedException) {
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
