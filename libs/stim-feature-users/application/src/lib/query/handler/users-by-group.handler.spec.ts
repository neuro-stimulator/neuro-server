import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UsersByGroupQuery } from '../impl/users-by-group.query';

import { UsersByGroupHandler } from './users-by-group.handler';

describe('UsersByGroupHandler', () => {
  let testingModule: TestingModule;
  let handler: UsersByGroupHandler;
  let service: MockType<UsersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersByGroupHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UsersByGroupHandler>(UsersByGroupHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  it('positive - should find user by id', async () => {
    const groups: number[] = [1];
    const users: User[] = [createEmptyUser()];
    const query = new UsersByGroupQuery(groups);

    service.findAll.mockReturnValue(users);

    const result: User[] = await handler.execute(query);

    expect(result).toEqual(users);
    expect(result[0]).not.toHaveProperty('password');
  });
});
