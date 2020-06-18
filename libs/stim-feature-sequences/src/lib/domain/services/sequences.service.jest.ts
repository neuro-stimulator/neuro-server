import { MockType } from 'apps/server/src/app/test-helpers';
import { SequencesService } from 'libs/stim-feature-sequences/src/lib/domain/services/sequences.service';

export const createSequencesServiceMock: () => MockType<
  SequencesService
> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  experimentsAsSequenceSource: jest.fn(),
  validateSequence: jest.fn(),
  nameExists: jest.fn(),
  registerMessagePublisher: jest.fn(),
  publishMessage: jest.fn(),
}));
