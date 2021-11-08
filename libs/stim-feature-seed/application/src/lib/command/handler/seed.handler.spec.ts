import { Test, TestingModule } from '@nestjs/testing';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@neuro-server/stim-feature-file-browser';
import { DataContainer, DataContainers, SeedStatistics } from '@neuro-server/stim-feature-seed/domain';
import { DisableTriggersCommand, EnableTriggersCommand } from '@neuro-server/stim-feature-triggers/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createSeederServiceProviderServiceMock } from '../../service/seeder-service-provider.service.jest';
import { SeederServiceProvider } from '../../service/seeder-service-provider.service';
import { SeedCommand } from '../impl/seed.command';
import { SeedHandler } from './seed.handler';
import { CommandBus } from '@nestjs/cqrs';

describe('SeedHandler', () => {
  let testingModule: TestingModule;
  let handler: SeedHandler;
  let commandBus: MockType<CommandBus>;
  let service: MockType<SeederServiceProvider>;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SeedHandler,
        {
          provide: SeederServiceProvider,
          useFactory: createSeederServiceProviderServiceMock,
        },
        {
          provide: FileBrowserFacade,
          useValue: {
            getContent: jest.fn(),
            readPrivateJSONFile: jest.fn(),
          },
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SeedHandler>(SeedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    service = testingModule.get<MockType<SeederServiceProvider>>(SeederServiceProvider);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
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

    facade.getContent.mockReturnValueOnce(dataContainerFiles);
    facade.readPrivateJSONFile.mockReturnValueOnce(dataContainer);
    service.seedDatabase.mockReturnValueOnce(expectedStatistics);

    const statistics: SeedStatistics = await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new DisableTriggersCommand()]);
    expect(service.seedDatabase).toBeCalledWith(dataContainers);
    expect(statistics).toBe(expectedStatistics);
    expect(commandBus.execute.mock.calls[1]).toEqual([new EnableTriggersCommand()]);
  });
});
