import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyUser, User } from '@stechy1/diplomka-share';

import { USER_INSERT_GROUP, UserNotValidException } from '@neuro-server/stim-feature-users/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { UserValidateCommand } from '../impl/user-validate.command';

import { UserValidateHandler } from './user-validate.handler';

describe('UserValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: UserValidateHandler;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [UserValidateHandler],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw exception when not valid', () => {
    const user: User = createEmptyUser();
    const command = new UserValidateCommand(user);

    expect(() => handler.execute(command)).rejects.toThrow(new UserNotValidException(user, []));
  });
});
