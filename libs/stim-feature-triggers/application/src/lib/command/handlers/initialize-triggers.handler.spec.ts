import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { FileRecord } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { createTriggersServiceMock } from '../../service/triggers.service.jest';
import { TriggersService } from '../../service/triggers.service';
import { InitializeTriggersCommand } from '../impl/initialize-triggers.command';
import { InitializeTriggersHandler } from './initialize-triggers.handler';

import * as fs from 'fs';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';
jest.mock('fs');

describe('InitializeTriggersHandler', () => {
  let testingModule: TestingModule;
  let handler: InitializeTriggersHandler;
  let service: MockType<TriggersService>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InitializeTriggersHandler,
        {
          provide: TriggersService,
          useFactory: createTriggersServiceMock,
        },
        queryBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<InitializeTriggersHandler>(InitializeTriggersHandler);
    // @ts-ignore
    service = testingModule.get<MockType<TriggersService>>(TriggersService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
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
    const pathToFile1 = 'path/to/file/1';
    const pathToFile2 = 'path/to/file/2';
    const file1Content = 'dummy 1 content of trigger';
    const file2Content = 'dummy 2 content of trigger';
    const command = new InitializeTriggersCommand();

    queryBus.execute.mockReturnValueOnce(fileRecords);
    queryBus.execute.mockReturnValueOnce(pathToFile1);
    queryBus.execute.mockReturnValueOnce(pathToFile2);

    (fs.readFileSync as jest.Mock).mockReturnValueOnce(file1Content);
    (fs.readFileSync as jest.Mock).mockReturnValueOnce(file2Content);

    await handler.execute(command);

    expect(service.initializeTriggers).toBeCalledWith([file1Content, file2Content]);
  });

  it('negative - should not initialize triggers when folder is not reachable', async () => {
    const invalidPath = 'invalidPath';
    const command = new InitializeTriggersCommand();

    queryBus.execute.mockImplementationOnce(() => {
      throw new FileNotFoundException(invalidPath);
    });

    await handler.execute(command);

    expect(service.initializeTriggers).not.toBeCalled();
  });
});
