import { Test, TestingModule } from '@nestjs/testing';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createTriggersServiceMock } from '../../service/triggers.service.jest';
import { TriggersService } from '../../service/triggers.service';
import { InitializeTriggersCommand } from '../impl/initialize-triggers.command';
import { InitializeTriggersHandler } from './initialize-triggers.handler';

describe('InitializeTriggersHandler', () => {
  let testingModule: TestingModule;
  let handler: InitializeTriggersHandler;
  let service: MockType<TriggersService>;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InitializeTriggersHandler,
        {
          provide: TriggersService,
          useFactory: createTriggersServiceMock,
        },
        {
          provide: FileBrowserFacade,
          useValue: {
            getContent: jest.fn(),
          },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<InitializeTriggersHandler>(InitializeTriggersHandler);
    // @ts-ignore
    service = testingModule.get<MockType<TriggersService>>(TriggersService);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should initialize necessary triggers', async () => {
    const fileRecords: FileRecord[] = [
      {
        name: 'dummy1.trigger.sql',
        extention: 'sql',
        isDirectory: false,
        isImage: false,
        path: 'dummy',
        selected: false,
        hash: '',
      },
      {
        name: 'dummy2.trigger.sql',
        extention: 'sql',
        isDirectory: false,
        isImage: false,
        path: 'dummy',
        selected: false,
        hash: '',
      },
      {
        name: 'invalid.trigger',
        extention: 'sql',
        isDirectory: false,
        isImage: false,
        path: 'dummy',
        selected: false,
        hash: '',
      },
    ];
    const file1Content = 'dummy 1 content of trigger';
    const file2Content = 'dummy 2 content of trigger';
    const command = new InitializeTriggersCommand();

    facade.getContent.mockReturnValueOnce(fileRecords);
    facade.getContent.mockReturnValueOnce(file1Content);
    facade.getContent.mockReturnValueOnce(file2Content);

    await handler.execute(command);

    expect(service.initializeTriggers).toBeCalledWith([file1Content, file2Content]);
  });
});
