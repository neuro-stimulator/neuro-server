import { Repository } from 'typeorm';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';
import { ExperimentResultsRepository } from './experiment-results.repository';
import { ExperimentResultEntity } from '../model/entity/experiment-result.entity';

export const repositoryExperimentResultEntityMock: MockType<Repository<ExperimentResultEntity>> = createRepositoryMock();

export const experimentResultsRepositoryProvider = {
  provide: ExperimentResultsRepository,
  useValue: new ExperimentResultsRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentResultEntityMock,
  }),
};
