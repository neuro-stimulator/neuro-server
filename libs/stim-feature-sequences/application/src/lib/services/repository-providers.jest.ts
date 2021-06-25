import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { Repository } from 'typeorm';

import { SequenceEntity, SequenceRepository } from '@diplomka-backend/stim-feature-sequences/domain';

export const repositorySequenceEntityMock: MockType<Repository<SequenceEntity>> = createRepositoryMock();

export const sequencesRepositoryProvider = {
  provide: SequenceRepository,
  useValue: new SequenceRepository({
    // @ts-ignore
    getRepository: () => repositorySequenceEntityMock,
  }),
};
