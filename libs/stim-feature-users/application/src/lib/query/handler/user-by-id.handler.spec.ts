import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'test-helpers/test-helpers';
import DoneCallback = jest.DoneCallback;

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { UserIdNotFoundException } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { createUsersServiceMock } from '../../service/users.service.jest';
import { UserByIdQuery } from '../impl/user-by-id.query';
import { UserByIdHandler } from './user-by-id.handler';

describe('UserByEmail', () => {
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

    handler = testingModule.get<UserByIdHandler>(UserByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<UsersService>>(UsersService);
  });

  it('positive - should find user by id', async () => {
    const user: User = createEmptyUser();
    user.id = 1;
    const query = new UserByIdQuery(user.id);

    service.byId.mockReturnValue(user);

    const result = await handler.execute(query);

    expect(result).toEqual(user);
  });

  it('negative - should throw exception when user not found', async (done: DoneCallback) => {
    const userID = 1;
    const query = new UserByIdQuery(userID);

    service.byId.mockImplementation(() => {
      throw new UserIdNotFoundException(userID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'UserIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof UserIdNotFoundException) {
        expect(e.userID).toEqual(userID);
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
