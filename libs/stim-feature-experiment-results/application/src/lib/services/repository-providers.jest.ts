import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

import { ExperimentResultsRepository, ExperimentResultEntity } from '@diplomka-backend/stim-feature-experiment-results/domain';

export const repositoryExperimentResultEntityMock: RepositoryMockType<ExperimentResultEntity> = createRepositoryMock();

export const experimentResultsRepositoryProvider = {
  provide: ExperimentResultsRepository,
  useValue: new ExperimentResultsRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentResultEntityMock,
  }),
};
