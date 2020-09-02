import { Repository } from 'typeorm';

import { UserEntity, UsersRepository } from '@diplomka-backend/stim-feature-users/domain';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

export const repositoryUserEntityMock: MockType<Repository<UserEntity>> = createRepositoryMock();

export const usersRepositoryProvider = {
  provide: UsersRepository,
  useValue: new UsersRepository({
    // @ts-ignore
    getRepository: () => repositoryUserEntityMock,
  }),
};
