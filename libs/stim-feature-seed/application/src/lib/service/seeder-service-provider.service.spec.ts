import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { DataContainer, EntityStatistic, FailedReason, SeederService, SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from './seeder-service-provider.service';

describe('SeederServiceProvider', () => {
  let testingModule: TestingModule;
  let service: SeederServiceProvider;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SeederServiceProvider,
        {
          provide: EntityManager,
          useFactory: () => ({ getRepository: () => jest.fn() }),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<SeederServiceProvider>(SeederServiceProvider);
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
      const entity1 = { name: 'dummyEntity1' };
      const seeder1: SeederService<unknown> = createDummySeederService();
      const entity2 = { name: 'dummyEntity2' };
      const seeder2: SeederService<unknown> = createDummySeederService();
      const dataContainer: Record<string, DataContainer[]> = {
        dummyEntity1: [{ entities: [{ field1: 'value1' }], entityName: 'dummyEntity1' }],
        dummyEntity2: [{ entities: [{ field2: 'value2' }], entityName: 'dummyEntity2' }],
      };
      const entityStatistics: EntityStatistic = {
        successful: {
          inserted: 0,
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
      const seedStatistics: SeedStatistics = {
        dummyEntity1: entityStatistics,
        dummyEntity2: entityStatistics,
      };

      ((seeder1 as unknown) as MockType<SeederService<unknown>>).seed.mockReturnValueOnce(entityStatistics);
      ((seeder2 as unknown) as MockType<SeederService<unknown>>).seed.mockReturnValueOnce(entityStatistics);

      await service.registerSeeder(seeder1, entity1);
      await service.registerSeeder(seeder2, entity2);
      const result = await service.seedDatabase(dataContainer);

      expect(result).toEqual(seedStatistics);
    });
  });

  function createDummySeederService(): SeederService<unknown> {
    return jest.fn(() => ({
      seed: jest.fn(),
    }))();
  }
});
