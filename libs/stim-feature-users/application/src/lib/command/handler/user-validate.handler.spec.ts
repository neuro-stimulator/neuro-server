import { Test, TestingModule } from '@nestjs/testing';

import DoneCallback = jest.DoneCallback;

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { USER_INSERT_GROUP, UserNotValidException } from '@diplomka-backend/stim-feature-users/domain';

import { UserValidateCommand } from '../impl/user-validate.command';
import { UserValidateHandler } from './user-validate.handler';

describe('UserValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: UserValidateHandler;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [UserValidateHandler],
    }).compile();

    handler = testingModule.get<UserValidateHandler>(UserValidateHandler);
  });

  it('positive - should validate user', async () => {
    const user: User = createEmptyUser();
    user.username = 'user';
    user.email = 'aaa@bbb.cc';
    user.password = '1234567890';
    const command = new UserValidateCommand(user, [USER_INSERT_GROUP]);

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const user: User = createEmptyUser();
    const command = new UserValidateCommand(user);

    try {
      await handler.execute(command);
      done.fail('UserNotValidException exception was thrown');
    } catch (e) {
      if (e instanceof UserNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown');
      }
    }
  });
});
