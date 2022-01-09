import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserIdNotFoundException } from '@neuro-server/stim-feature-users/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserByIdQuery } from '../impl/user-by-id.query';
import { UserByIdHandler } from './user-by-id.handler';

describe('UserByIdHandler', () => {
  let testingModule: TestingModule;
  let handler: UserByIdHandler;
  let service: MockType<UsersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserByIdHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UserByIdHandler>(UserByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  it('positive - should find user by id', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const query = new UserByIdQuery(user.id);

    service.byId.mockReturnValue(user);

    const result: User = await handler.execute(query);

    expect(result).toEqual(user);
    expect(result).not.toHaveProperty('password');
  });

  it('negative - should throw exception when user not found', () => {
    const userID = 1;
    const query = new UserByIdQuery(userID);

    service.byId.mockImplementation(() => {
      throw new UserIdNotFoundException(userID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new UserIdNotFoundException(userID));
  });
});
