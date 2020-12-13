import { TruncateHandler } from './truncate.handler';
import { Test, TestingModule } from '@nestjs/testing';

import { SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { createSeederServiceProviderServiceMock } from '../../service/seeder-service-provider.service.jest';
import { TruncateCommand } from '../impl/truncate.command';

describe('TruncateHandler', () => {
  let testingModule: TestingModule;
  let handler: TruncateHandler;
  let service: MockType<SeederServiceProvider>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        TruncateHandler,
        {
          provide: SeederServiceProvider,
          useFactory: createSeederServiceProviderServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<TruncateHandler>(TruncateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SeederServiceProvider>>(SeederServiceProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should truncate database', async () => {
    const statistics: SeedStatistics = {};
    const command = new TruncateCommand();

    service.truncateDatabase.mockReturnValueOnce(statistics);

    const result: SeedStatistics = await handler.execute(command);

    expect(result).toEqual(statistics);
  });
});
