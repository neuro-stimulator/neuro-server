import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserIdNotFoundException } from '@diplomka-backend/stim-feature-users/domain';
import { UserWasNotDeletedException } from '@diplomka-backend/stim-feature-users/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UserWasDeletedEvent } from '../../event/impl/user-was-deleted.event';
import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserDeleteCommand } from '../impl/user-delete.command';
import { UserDeleteHandler } from './user-delete.handler';

describe('UserDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: UserDeleteHandler;
  let service: MockType<UsersService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserDeleteHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UserDeleteHandler>(UserDeleteHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.delete.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should delete user', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserDeleteCommand(user.id);

    service.byId.mockReturnValue(user);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(user.id);
    expect(eventBus.publish).toBeCalledWith(new UserWasDeletedEvent(user));
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const userID = -1;
    const command = new UserDeleteCommand(userID);

    service.byId.mockImplementation(() => {
      throw new UserIdNotFoundException(userID);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof UserIdNotFoundException) {
        expect(e.userID).toEqual(userID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const userID = -1;
    const command = new UserDeleteCommand(userID);

    service.byId.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserResultWasNotDeletedException was not thrown' });
    } catch (e) {
      if (e instanceof UserWasNotDeletedException) {
        expect(e.userID).toEqual(userID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const userID = -1;
    const command = new UserDeleteCommand(userID);

    service.byId.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'UserResultWasNotDeletedException was not thrown' });
    } catch (e) {
      if (e instanceof UserWasNotDeletedException) {
        expect(e.userID).toEqual(userID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
