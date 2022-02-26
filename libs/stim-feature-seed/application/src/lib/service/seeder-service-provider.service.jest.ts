import { EntityManager, EntityMetadata, Repository } from 'typeorm';

import { DataContainers, EntityStatistic, EntityTransformerService, SeederService } from '@neuro-server/stim-feature-seed/domain';

import { MockType } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from './seeder-service-provider.service';

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

export class DummySeedService implements SeederService<unknown> {

  constructor(private readonly statistics: EntityStatistic, private readonly entities: unknown[]) {}

  async seed(
    repository: Repository<unknown>,
    data: unknown[],
    dataContainers: DataContainers,
    entityTransformer?: EntityTransformerService,
    entityManager?: EntityManager
  ): Promise<[EntityStatistic, unknown[]]> {
    return [this.statistics, this.entities];
  }

}
