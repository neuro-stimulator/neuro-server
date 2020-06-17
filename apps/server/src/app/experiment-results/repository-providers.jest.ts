import { Repository } from 'typeorm';

import { createRepositoryMock, MockType } from '../test-helpers';
import { ExperimentResultsRepository } from 'libs/stim-feature-experiment-results/src/lib/domain/repository/experiment-results.repository';
import { ExperimentResultEntity } from 'libs/stim-feature-experiment-results/src/lib/domain/model/entity/experiment-result.entity';

export const repositoryExperimentResultEntityMock: MockType<Repository<
  ExperimentResultEntity
>> = createRepositoryMock();

export const experimentResultsRepositoryProvider = {
  provide: ExperimentResultsRepository,
  // @ts-ignore
  useValue: new ExperimentResultsRepository({
    getRepository: () => repositoryExperimentResultEntityMock,
  }),
};
