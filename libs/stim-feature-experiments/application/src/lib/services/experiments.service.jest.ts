import { MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from './experiments.service';

export const createExperimentsServiceMock: () => MockType<ExperimentsService> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  usedOutputMultimedia: jest.fn(),
  nameExists: jest.fn(),
}));
