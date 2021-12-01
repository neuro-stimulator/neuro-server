import { Test, TestingModule } from '@nestjs/testing';

import { AclRole, createEmptyAclRole, createEmptyUser, User } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { AssignUserRoleHandler } from './assign-user-role.handler';
import { AssignUserRoleCommand } from '../impl/assign-user-role.command';

describe('AssignUserRoleHandler', () => {

  let testingModule: TestingModule;
  let handler: AssignUserRoleHandler;
  let service: MockType<UsersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AssignUserRoleHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AssignUserRoleHandler>(AssignUserRoleHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should assign default roles to user', async () => {
    const userId = 1;
    const user: User = createEmptyUser();
    user.id = userId;
    const defaultRole: AclRole = createEmptyAclRole();
    const defaultRoles: AclRole[] = [defaultRole];
    const command = new AssignUserRoleCommand(userId, defaultRoles);

    service.byId.mockReturnValueOnce(user);

    await handler.execute(command);

    expect(service.update).toBeCalledWith(user);
  });
});
