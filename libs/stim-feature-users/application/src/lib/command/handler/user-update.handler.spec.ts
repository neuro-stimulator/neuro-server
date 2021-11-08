import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@neuro-server/stim-lib-common';
import { UserIdNotFoundException, UserNotValidException, UserWasNotUpdatedException } from '@neuro-server/stim-feature-users/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw exception when user not found', () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new UserIdNotFoundException(user.id);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new UserIdNotFoundException(user.id));
  });

  it('negative - should throw exception when user is not valid', () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const errors: ValidationErrors = [];
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockImplementation(() => {
      throw new UserNotValidException(user, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new UserNotValidException(user, errors));
  });

  it('negative - should throw exception when command failed', () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new UserWasNotUpdatedException(user));
  });

  it('negative - should throw exception when unknown error', () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const command = new UserUpdateCommand(user);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new UserWasNotUpdatedException(user));
  });
});
