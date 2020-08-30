import { Repository } from 'typeorm';

import { UserEntity, UsersRepository } from '@diplomka-backend/stim-feature-users/domain';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

export const repositoryUserEntityMock: MockType<Repository<UserEntity>> = createRepositoryMock();

export const usersRepositoryProvider = {
  provide: UsersRepository,
  // @ts-ignore
  useValue: new UsersRepository({
    getRepository: () => repositoryUserEntityMock,
  }),
};
