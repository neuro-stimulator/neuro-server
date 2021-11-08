import { UserEntity, UsersRepository } from '@neuro-server/stim-feature-users/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

export const repositoryUserEntityMock: RepositoryMockType<UserEntity> = createRepositoryMock();

export const usersRepositoryProvider = {
  provide: UsersRepository,
  useValue: new UsersRepository({
    // @ts-ignore
    getRepository: () => repositoryUserEntityMock,
  }),
};
