import { QueryFailedError, Repository } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';

import { EntityStatistic } from '@neuro-server/stim-feature-seed/domain';

import { MockType } from 'test-helpers/test-helpers';

import { BaseSeederService } from './base-seeder.service';

describe('BaseSeederService', () => {
  let service: BaseSeederService<DummyEntity>;
  let repository: Repository<DummyEntity>;

  beforeEach(() => {
    service = new SimpleSeederService();

    repository = ({
      save: jest.fn(),
    } as unknown) as Repository<DummyEntity>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should seed database', async () => {
    const data: DummyEntity[] = [{ field: 'value1' }, { field: 'value2' }];
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

    const statistics: EntityStatistic = await service.seed(repository, data);

    expect(statistics).toEqual(expectedStatistics);
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

    const statistics: EntityStatistic = await service.seed(repository, data);

    expect(statistics).toEqual(expectedStatistics);
  });

  class DummyEntity {
    field: string;
  }

  class SimpleSeederService extends BaseSeederService<DummyEntity> {
    protected convertEntities(data: DummyEntity[]): DummyEntity[] {
      return plainToClass(DummyEntity, data);
    }
  }
});
