import { MockType } from '../test-helpers';
import { ExperimentsService } from './experiments.service';

export const createExperimentsServiceMock: () => MockType<ExperimentsService> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  usedOutputMultimedia: jest.fn(),
  validateExperiment: jest.fn(),
  nameExists: jest.fn(),
  registerMessagePublisher: jest.fn(),
  publishMessage: jest.fn()
}));
