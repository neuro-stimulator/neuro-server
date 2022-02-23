import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

import { RefreshTokenEntity, RefreshTokenRepository } from '@neuro-server/stim-feature-auth/domain';

export const repositoryRefreshTokenEntityMock: RepositoryMockType<RefreshTokenEntity> = createRepositoryMock();

export const refreshTokenRepositoryProvider = {
  provide: RefreshTokenRepository,
  useValue: new RefreshTokenRepository({
    // @ts-ignore
    getRepository: () => repositoryRefreshTokenEntityMock,
  }),
};