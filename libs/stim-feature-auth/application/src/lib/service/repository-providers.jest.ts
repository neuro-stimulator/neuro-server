import { Repository } from 'typeorm';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { RefreshTokenEntity, RefreshTokenRepository } from '@diplomka-backend/stim-feature-auth/domain';

export const repositoryRefreshTokenEntityMock: MockType<Repository<RefreshTokenEntity>> = createRepositoryMock();

export const refreshTokenRepositoryProvider = {
  provide: RefreshTokenRepository,
  useValue: new RefreshTokenRepository({
    // @ts-ignore
    getRepository: () => repositoryRefreshTokenEntityMock,
  }),
};
