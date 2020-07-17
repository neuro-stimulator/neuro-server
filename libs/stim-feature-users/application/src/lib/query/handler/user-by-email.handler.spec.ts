import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'test-helpers/test-helpers';
import DoneCallback = jest.DoneCallback;

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserNotFoundException } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserByEmailQuery } from '../impl/user-by-email.query';
import { UserByEmailHandler } from './user-by-email.handler';

describe('UserByEmail', () => {
  let testingModule: TestingModule;
  let handler: UserByEmailHandler;
  let service: MockType<UsersService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UserByEmailHandler,
        {
          provide: UsersService,
          useFactory: createUsersServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<UserByEmailHandler>(UserByEmailHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  it('positive - should find user by email', async () => {
    const user: User = createEmptyUser();
    user.email = 'aaa@bbb.ccc';
    const query = new UserByEmailQuery(user.email);

    service.byEmail.mockReturnValue(user);

    const result = await handler.execute(query);

    expect(result).toEqual(user);
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const email = 'aaa@bbb.ccc';
    const query = new UserByEmailQuery(email);

    service.byEmail.mockImplementation(() => {
      throw new UserNotFoundException();
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'UserNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
