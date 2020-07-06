import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsFacade } from './experiment-results.facade';

export const createExperimentResultsFacadeMock: () => MockType<ExperimentResultsFacade> = jest.fn(() => ({
  experimentResultsAll: jest.fn(),
  validate: jest.fn(),
  experimentResultByID: jest.fn(),
  resultData: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  nameExists: jest.fn(),
}));
