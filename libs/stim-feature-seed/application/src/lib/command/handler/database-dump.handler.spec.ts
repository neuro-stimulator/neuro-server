import * as fs from 'fs';

import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseDump } from '@neuro-server/stim-feature-seed/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { DatabaseDumpService } from '../../service/database-dump.service';
import { createDatabaseDumpServiceMock } from '../../service/database-dump.service.jest';
import { DatabaseDumpCommand } from '../impl/database-dump.command';

import { DatabaseDumpHandler } from './database-dump.handler';

jest.mock('fs');

describe('DatabaseDumpHandler', () => {
  let testingModule: TestingModule;
  let handler: DatabaseDumpHandler;
  let service: MockType<DatabaseDumpService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        DatabaseDumpHandler,
        {
          provide: DatabaseDumpService,
          useFactory: createDatabaseDumpServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<DatabaseDumpHandler>(DatabaseDumpHandler);
    // @ts-ignore
    service = testingModule.get<MockType<DatabaseDumpService>>(DatabaseDumpService);
  });

  it('positive - should create database dump', async () => {
    const outputRootPath = '/tmp/database_dump';
    const databaseDump: DatabaseDump = {
      SimpleEntity: [
        {
          property1: 'value1',
          property2: 'value2',
        },
      ],
    };
    const command = new DatabaseDumpCommand(outputRootPath);

    service.dumpDatabase.mockReturnValueOnce(databaseDump);

    await handler.execute(command);

    expect(fs.writeFileSync).toBeCalled();
  });
});
