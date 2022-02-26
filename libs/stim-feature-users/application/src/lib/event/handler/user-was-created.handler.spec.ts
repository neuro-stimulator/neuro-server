
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AclRole, createEmptyAclRole } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';


import { AssignUserRoleCommand } from '../../command/impl/assign-user-role.command';
import { UserWasCreatedEvent } from '../impl/user-was-created.event';

import { UserWasCreatedHandler } from './user-was-created.handler';

describe('UserWasCreatedHandler', () => {
  let testingModule: TestingModule;
  let handler: UserWasCreatedHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserWasCreatedHandler,
        queryBusProvider,
        commandBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UserWasCreatedHandler>(UserWasCreatedHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should assign default user roles to new user', async () => {
    const userId = 1;
    const defaultRoles: AclRole[] = [createEmptyAclRole()];
    const event = new UserWasCreatedEvent(userId);

    queryBus.execute.mockReturnValueOnce(defaultRoles);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new AssignUserRoleCommand(userId, defaultRoles));
  });
});
