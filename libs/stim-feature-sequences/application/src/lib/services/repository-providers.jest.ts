import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { Repository } from 'typeorm';

import { SequenceEntity } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceRepository } from '@diplomka-backend/stim-feature-sequences/domain';

export const repositorySequenceEntityMock: MockType<Repository<SequenceEntity>> = createRepositoryMock();

export const sequencesRepositoryProvider = {
  provide: SequenceRepository,
  // @ts-ignore
  useValue: new SequenceRepository({
    getRepository: () => repositorySequenceEntityMock,
  }),
};
