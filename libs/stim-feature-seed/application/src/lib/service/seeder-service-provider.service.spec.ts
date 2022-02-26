import { EntityManager, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyEntityStatistic, DataContainers, EntityStatistic, SeederService, SeedStatistics } from '@neuro-server/stim-feature-seed/domain';

import { eventBusProvider, NoOpLogger } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from './seeder-service-provider.service';
import { DummySeedService, entityMetadatas } from './seeder-service-provider.service.jest';

describe('SeederServiceProvider', () => {
  let testingModule: TestingModule;
  let service: SeederServiceProvider;
  let manager: EntityManager;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SeederServiceProvider,
        {
          provide: EntityManager,
          useFactory: () => ({
            getRepository: () => new Repository(),
            connection: {
              entityMetadatas: jest.fn()
            }
          }),
        },
        eventBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<SeederServiceProvider>(SeederServiceProvider);

    manager = testingModule.get<EntityManager>(EntityManager);
    Object.defineProperty(manager.connection, 'entityMetadatas', {
      get: jest.fn(() => entityMetadatas),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerSeeder', () => {
    it('positive - should register seeder service for entity', async () => {
      const entity = { name: 'dummyEntity' };
      const seeder = createDummySeederService();

      service.registerSeeder(seeder, entity);

      expect(service.seederServices[entity.name].services[0]).toEqual(seeder);
    });

    it('positive - should register multiple seeder services for one entity', async () => {
      const entity1 = { name: 'dummyEntity1' };
      const seeder1 = createDummySeederService();
      const seeder2 = createDummySeederService();

      service.registerSeeder(seeder1, entity1);
      service.registerSeeder(seeder2, entity1);

      expect(Object.keys(service.seederServices)).toHaveLength(1);
      expect(service.seederServices[entity1.name].services).toHaveLength(2);
    });

    it('positive - should register multimple seeder services for multiple entities', async () => {
      const entity1 = { name: 'dummyEntity1' };
      const seeder1 = createDummySeederService();
      const entity2 = { name: 'dummyEntity2' };
      const seeder2 = createDummySeederService();

      service.registerSeeder(seeder1, entity1);
      service.registerSeeder(seeder2, entity2);

      expect(Object.keys(service.seederServices)).toHaveLength(2);
      expect(service.seederServices[entity1.name].services).toHaveLength(1);
      expect(service.seederServices[entity2.name].services).toHaveLength(1);
    });
  });

  describe('seedDatabase', () => {
    it('positive - should seed database', async () => {
      const entityStatistics: EntityStatistic = {
        successful: {
          inserted: 1,
          updated: 0,
          deleted: 0,
        },
        failed: {
          inserted: {
            count: 0,
            reason: [],
          },
          updated: {
            count: 0,
            reason: [],
          },
          deleted: {
            count: 0,
            reason: [],
          },
        },
      };
      const entity1 = { name: 'EntityName1' };
      const seeder1: SeederService<unknown> = createDummySeederService(entityStatistics, [entity1]);
      const entity2 = { name: 'EntityName2' };
      const seeder2: SeederService<unknown> = createDummySeederService(entityStatistics, [entity2]);
      const dataContainer: DataContainers = {
        EntityName1: [{ entities: [{ field1: 'value1' }], entityName: 'EntityName1' }],
        EntityName2: [{ entities: [{ field2: 'value2' }], entityName: 'EntityName2' }],
      };

      const seedStatistics: SeedStatistics = {
        EntityName1: entityStatistics,
        EntityName2: entityStatistics,
      };

      service.registerSeeder(seeder1, entity1);
      service.registerSeeder(seeder2, entity2);
      const result = await service.seedDatabase(dataContainer);

      expect(result).toEqual(seedStatistics);
    });
  });

  function createDummySeederService(statistics: EntityStatistic = createEmptyEntityStatistic(), entities: unknown[] = []): SeederService<unknown> {
    return new DummySeedService(statistics, entities);
  }
});
