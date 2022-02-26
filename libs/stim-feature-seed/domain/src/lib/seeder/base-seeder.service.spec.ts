import { QueryFailedError, Repository } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';

import { DeepPartial } from '@neuro-server/stim-lib-common';

import { MockType } from 'test-helpers/test-helpers';

import { DataContainers } from '../model/data-container';
import { EntityTransformerService } from '../model/entity-transformer-service';
import { EntityStatistic } from '../model/seed-statistics';

import { BaseEntityTransformerService } from './base-entity-transformer.service';
import { BaseSeederService } from './base-seeder.service';

describe('BaseSeederService', () => {
  let service: BaseSeederService<DummyEntity>;
  let repository: Repository<DummyEntity>;
  let emptyTransformerProvider: EntityTransformerService;
  let dataContainers: DataContainers;

  beforeEach(() => {
    service = new SimpleSeederService();
    emptyTransformerProvider = new EmptyEntityTransformer();

    repository = ({
      save: jest.fn(),
      findOne: jest.fn()
    } as unknown) as Repository<DummyEntity>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should seed database', async () => {
    const data: DummyEntity[] = [{ field: 'value1' }, { field: 'value2' }];
    const insertedData: DummyEntity[] = [{ id: 1, field: 'value1' }, { id: 2, field: 'value2' }];
    const expectedStatistics: EntityStatistic = {
      successful: {
        inserted: data.length,
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

    ((repository as unknown) as MockType<Repository<DummyEntity>>).save.mockReturnValueOnce(insertedData[0]);
    ((repository as unknown) as MockType<Repository<DummyEntity>>).save.mockReturnValueOnce(insertedData[1]);

    ((repository as unknown) as MockType<Repository<DummyEntity>>).findOne.mockReturnValueOnce(insertedData[0]);
    ((repository as unknown) as MockType<Repository<DummyEntity>>).findOne.mockReturnValueOnce(insertedData[1]);

    const [statistics, entities]: [EntityStatistic, DummyEntity[]] = await service.seed(repository, data, dataContainers, emptyTransformerProvider);

    expect(statistics).toEqual(expectedStatistics);
    expect(entities).toHaveLength(data.length);
  });

  it('negative - should create failed insert entry', async () => {
    const data: DummyEntity[] = [{ field: 'value1' }];
    const expectedStatistics: EntityStatistic = {
      successful: {
        inserted: 0,
        updated: 0,
        deleted: 0,
      },
      failed: {
        inserted: {
          count: 1,
          reason: [{ code: undefined, query: 'query', errno: undefined, message: '', parameters: [] }],
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

    ((repository as unknown) as MockType<Repository<DummyEntity>>).save.mockImplementationOnce(() => {
      throw new QueryFailedError('query', [], '');
    });

    const [statistics, entities]: [EntityStatistic, DummyEntity[]] = await service.seed(repository, data, dataContainers, emptyTransformerProvider);

    expect(statistics).toEqual(expectedStatistics);
    expect(entities).toHaveLength(0);
  });

  interface Dummy {
    id?: number;
    field: string;
  }

  class DummyEntity implements Dummy{
    id?: number;
    field: string;
  }

  class SimpleSeederService extends BaseSeederService<DummyEntity> {
    protected convertEntities(data: DummyEntity[]): DummyEntity[] {
      return plainToClass(DummyEntity, data);
    }
  }

  class EmptyEntityTransformer extends BaseEntityTransformerService<Dummy, DummyEntity> {
    transform(fromType: Dummy, _dataContainers: DataContainers): DeepPartial<DummyEntity> {
      return fromType
    }
  }
});
