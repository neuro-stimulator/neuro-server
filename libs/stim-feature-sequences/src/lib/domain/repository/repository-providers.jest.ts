import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { Repository } from 'typeorm';

import { SequenceEntity } from '@diplomka-backend/stim-feature-sequences';
import { SequenceRepository } from './sequence.repository';

export const repositorySequenceEntityMock: MockType<Repository<SequenceEntity>> = createRepositoryMock();

export const sequencesRepositoryProvider = {
  provide: SequenceRepository,
  useValue: new SequenceRepository({
    // @ts-ignore
    getRepository: () => repositorySequenceEntityMock,
  }),
};
