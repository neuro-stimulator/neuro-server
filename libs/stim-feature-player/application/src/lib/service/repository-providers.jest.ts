import { Repository } from 'typeorm';
import { Provider } from '@nestjs/common';

import { ExperimentStopConditionEntity, ExperimentStopConditionRepository } from '@diplomka-backend/stim-feature-player/domain';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

// @ts-ignore
export const repositoryExperimentStopConditionEntityMock: MockType<Repository<ExperimentStopConditionEntity>> = createRepositoryMock();

export const experimentStopConditionRepositoryProvider: Provider = {
  provide: ExperimentStopConditionRepository,
  useValue: new ExperimentStopConditionRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentStopConditionEntityMock,
  }),
};
