import { MockType } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from './seeder-service-provider.service';
import { EntityMetadata } from 'typeorm';

export const createSeederServiceProviderServiceMock: () => MockType<SeederServiceProvider> = jest.fn(() => ({
  registerSeeder: jest.fn(),
  seedDatabase: jest.fn(),
  truncateDatabase: jest.fn(),
  orderedServiceInformations: jest.fn(),
  seederServices: jest.fn(),
}));

export const entityMetadatas: EntityMetadata[] = [
  ({
    targetName: 'EntityTargetName1',
    name: 'EntityName1',
    ownRelations: [],
  } as unknown) as EntityMetadata,
  ({
    targetName: 'EntityTargetName2',
    name: 'EntityName2',
    ownRelations: [],
  } as unknown) as EntityMetadata,
  ({
    targetName: 'EntityTargetName3',
    name: 'EntityName3',
    ownRelations: [],
  } as unknown) as EntityMetadata,
];
