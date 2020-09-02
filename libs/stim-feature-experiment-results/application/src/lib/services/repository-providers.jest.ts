import { Repository } from 'typeorm';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsRepository } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { ExperimentResultEntity } from '@diplomka-backend/stim-feature-experiment-results/domain';

export const repositoryExperimentResultEntityMock: MockType<Repository<ExperimentResultEntity>> = createRepositoryMock();

export const experimentResultsRepositoryProvider = {
  provide: ExperimentResultsRepository,
  useValue: new ExperimentResultsRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentResultEntityMock,
  }),
};
