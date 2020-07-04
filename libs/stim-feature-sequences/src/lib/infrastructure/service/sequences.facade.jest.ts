import { MockType } from 'test-helpers/test-helpers';

import { SequencesFacade } from './sequences.facade';

export const createSequencesFacadeMock: () => MockType<SequencesFacade> = jest.fn(() => ({
  sequencesAll: jest.fn(),
  sequenceById: jest.fn(),
  validate: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  nameExists: jest.fn(),
  sequencesForExperiment: jest.fn(),
  generateSequenceForExperiment: jest.fn(),
}));
