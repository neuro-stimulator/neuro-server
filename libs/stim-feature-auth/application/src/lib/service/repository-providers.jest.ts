import { RefreshTokenEntity, RefreshTokenRepository } from '@neuro-server/stim-feature-auth/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

export const repositoryRefreshTokenEntityMock: RepositoryMockType<RefreshTokenEntity> = createRepositoryMock();

export const refreshTokenRepositoryProvider = {
  provide: RefreshTokenRepository,
  useValue: new RefreshTokenRepository({
    // @ts-ignore
    getRepository: () => repositoryRefreshTokenEntityMock,
  }),
};
