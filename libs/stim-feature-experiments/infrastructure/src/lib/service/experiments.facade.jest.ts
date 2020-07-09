import { MockType } from 'test-helpers/test-helpers';
import { ExperimentsFacade } from './experiments.facade';

export const createExperimentsFacadeMock: () => MockType<ExperimentsFacade> = jest.fn(() => ({
  experimentsAll: jest.fn(),
  filteredExperiments: jest.fn(),
  experimentByID: jest.fn(),
  validate: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  usedOutputMultimedia: jest.fn(),
  nameExists: jest.fn(),
  sequencesForExperiment: jest.fn(),
}));
