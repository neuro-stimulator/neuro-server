import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from './experiment-results.service';

export const createExperimentResultsServiceMock: () => MockType<ExperimentResultsService> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  nameExists: jest.fn(),
  clearRunningExperimentResult: jest.fn(),
  createEmptyExperimentResult: jest.fn(),
  activeExperimentResult: jest.fn(),
  activeExperimentResultData: jest.fn(),
  pushResultData: jest.fn(),
}));
