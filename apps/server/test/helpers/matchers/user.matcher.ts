import CustomMatcherResult = jest.CustomMatcherResult;
import expect = jest.Expect;

import { User } from '@stechy1/diplomka-share';

import { UserEntity } from '@neuro-server/stim-feature-users/domain';

expect.extend({
  toMatchUser(received: User[], argument: UserEntity[]): CustomMatcherResult {
    expect(received).toHaveLength(argument.length);

    const count = received.length;

    for (let i = 0; i < count; i++) {
      const receivedUser: User = received[i];
      const expectedUser: UserEntity = argument[i];

      expect(receivedUser).toEqual(
        expect.objectContaining({
          uuid: expectedUser.uuid,
          id: expectedUser.id,
          username: expectedUser.username,
          email: expectedUser.email,
          createdAt: expectedUser.createdAt,
          updatedAt: expectedUser.updatedAt,
          lastLoginDate: expectedUser.lastLoginDate
        } as User)
      )
    }

    return {
      message: () => 'User passing',
      pass: true,
    };
  }
})
