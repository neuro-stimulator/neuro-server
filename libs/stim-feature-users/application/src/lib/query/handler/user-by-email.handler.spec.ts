import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserNotFoundException } from '@neuro-server/stim-feature-users/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserByEmailPasswordQuery } from '../impl/user-by-email-password.query';
import { UserByEmailPasswordHandler } from './user-by-email-password.handler';

describe('UserByEmail', () => {
  let testingModule: TestingModule;
  let handler: UserByEmailPasswordHandler;
  let service: MockType<UsersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserByEmailPasswordHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UserByEmailPasswordHandler>(UserByEmailPasswordHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  it('positive - should find user by email', async () => {
    const user: User = createEmptyUser();
    user.email = 'aaa@bbb.ccc';
    user.password = 'hash';
    const password = 'password';
    const passwordValid = true;
    const query = new UserByEmailPasswordQuery(user.email, password);

    service.byEmail.mockReturnValue(user);
    service.comparePassword.mockReturnValue(passwordValid);

    const result = await handler.execute(query);

    expect(result).toEqual(user);
  });

  it('negative - should throw exception when user not found', () => {
    const email = 'aaa@bbb.ccc';
    const password = 'password';
    const query = new UserByEmailPasswordQuery(email, password);

    service.byEmail.mockImplementation(() => {
      throw new UserNotFoundException();
    });

    expect(() => handler.execute(query)).rejects.toThrow(new UserNotFoundException());
  });

  it('negative - should throw exception when password is not valid', () => {
    const user: User = createEmptyUser();
    user.email = 'aaa@bbb.ccc';
    user.password = 'hash';
    const password = 'password';
    const passwordValid = false;
    const query = new UserByEmailPasswordQuery(user.email, password);

    service.byEmail.mockReturnValue(user);
    service.comparePassword.mockReturnValue(passwordValid);

    expect(() => handler.execute(query)).rejects.toThrow(new UserNotFoundException());
  });
});
