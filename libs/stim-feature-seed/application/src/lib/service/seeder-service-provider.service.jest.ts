import { MockType } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from './seeder-service-provider.service';

export const createSeederServiceProviderServiceMock: () => MockType<SeederServiceProvider> = jest.fn(() => ({
  registerSeeder: jest.fn(),
  seedDatabase: jest.fn(),
  truncateDatabase: jest.fn(),
  orderedServiceInformations: jest.fn(),
  seederServices: jest.fn(),
}));
