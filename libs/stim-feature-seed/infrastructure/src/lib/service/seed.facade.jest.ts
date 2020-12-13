import { MockType } from 'test-helpers/test-helpers';

import { SeedFacade } from './seed.facade';

export const createSeedFacadeMock: () => MockType<SeedFacade> = jest.fn(() => ({
  seed: jest.fn(),
  truncate: jest.fn(),
}));
