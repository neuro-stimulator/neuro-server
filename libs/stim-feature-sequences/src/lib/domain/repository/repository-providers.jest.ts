import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { Repository } from 'typeorm';

import { SequenceEntity } from '../model/entity/sequence.entity';
import { SequenceRepository } from './sequence.repository';

export const repositorySequenceEntityMock: MockType<Repository<SequenceEntity>> = createRepositoryMock();

export const sequencesRepositoryProvider = {
  provide: SequenceRepository,
  useValue: new SequenceRepository({
    // @ts-ignore
    getRepository: () => repositorySequenceEntityMock,
  }),
};
