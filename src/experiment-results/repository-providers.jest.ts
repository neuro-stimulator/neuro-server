import { Repository } from 'typeorm';

import { createRepositoryMock, MockType } from '../test-helpers';
import { ExperimentResultsRepository } from './repository/experiment-results.repository';
import { ExperimentResultEntity } from './entity/experiment-result.entity';

export const repositoryExperimentResultEntityMock: MockType<Repository<ExperimentResultEntity>> = createRepositoryMock();

export const experimentResultsRepositoryProvider = {
  provide: ExperimentResultsRepository,
  // @ts-ignore
  useValue: new ExperimentResultsRepository({ getRepository: () => repositoryExperimentResultEntityMock })
};
