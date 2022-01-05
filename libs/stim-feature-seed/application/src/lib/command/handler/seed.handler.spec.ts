import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { FileRecord } from '@stechy1/diplomka-share';

import { DataContainer, DataContainers, SeedStatistics } from '@neuro-server/stim-feature-seed/domain';
import { DisableTriggersCommand, EnableTriggersCommand } from '@neuro-server/stim-feature-triggers/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { createSeederServiceProviderServiceMock } from '../../service/seeder-service-provider.service.jest';
import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { SeedCommand } from '../impl/seed.command';
import { SeedHandler } from './seed.handler';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

describe('SeedHandler', () => {
  let testingModule: TestingModule;
  let handler: SeedHandler;
  let commandBus: MockType<CommandBus>;
  let queryBus: MockType<QueryBus>;
  let service: MockType<SeederServiceProvider>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SeedHandler,
        {
          provide: SeederServiceProvider,
          useFactory: createSeederServiceProviderServiceMock,
        },
        queryBusProvider,
        commandBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SeedHandler>(SeedHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    service = testingModule.get<MockType<SeederServiceProvider>>(SeederServiceProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should seed database', async () => {
    const dataContainerFiles: FileRecord[] = [
      {
        name: 'dummy.json',
        extention: 'json',
        isDirectory: false,
        isImage: false,
        path: 'dummy',
        selected: false,
        hash: '',
      },
    ];
    const dataContainer: DataContainer = {
      entityName: 'dummyEntity',
      entities: [],
      order: 5,
    };
    const dataContainers: DataContainers = {
      dummyEntity: [dataContainer],
    };
    const expectedStatistics: SeedStatistics = {};
    const command = new SeedCommand();

    queryBus.execute.mockReturnValueOnce(dataContainerFiles);
    queryBus.execute.mockReturnValueOnce(dataContainer);
    service.seedDatabase.mockReturnValueOnce(expectedStatistics);

    const statistics: SeedStatistics = await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new DisableTriggersCommand()]);
    expect(service.seedDatabase).toBeCalledWith(dataContainers);
    expect(statistics).toBe(expectedStatistics);
    expect(commandBus.execute.mock.calls[1]).toEqual([new EnableTriggersCommand()]);
  });

  it('negative - should not seed database when data containers are not loaded', async () => {
    const invalidPath = 'invalidPath';
    const emptyStatistics: SeedStatistics = {};
    const command = new SeedCommand();

    queryBus.execute.mockImplementationOnce(() => {
      throw new FileNotFoundException(invalidPath);
    });

    const statistics: SeedStatistics = await handler.execute(command);

    expect(statistics).toEqual(emptyStatistics);
    expect(queryBus.execute.mock.calls).toHaveLength(1)
    expect(service.seedDatabase).not.toBeCalled();

  });
});
