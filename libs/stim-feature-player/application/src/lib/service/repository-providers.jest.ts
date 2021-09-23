import { Provider } from '@nestjs/common';

import { ExperimentStopConditionEntity, ExperimentStopConditionRepository } from '@diplomka-backend/stim-feature-player/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

// @ts-ignore
export const repositoryExperimentStopConditionEntityMock: RepositoryMockType<ExperimentStopConditionEntity> = createRepositoryMock();

export const experimentStopConditionRepositoryProvider: Provider = {
  provide: ExperimentStopConditionRepository,
  useValue: new ExperimentStopConditionRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentStopConditionEntityMock,
  }),
};
