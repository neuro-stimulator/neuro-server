import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

import { SequenceEntity, SequenceRepository } from '@neuro-server/stim-feature-sequences/domain';

export const repositorySequenceEntityMock: RepositoryMockType<SequenceEntity> = createRepositoryMock();

export const sequencesRepositoryProvider = {
  provide: SequenceRepository,
  useValue: new SequenceRepository({
    // @ts-ignore
    getRepository: () => repositorySequenceEntityMock,
  }),
};
