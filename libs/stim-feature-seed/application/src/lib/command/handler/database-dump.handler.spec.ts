import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { DatabaseDump } from '@diplomka-backend/stim-feature-seed/domain';

import { DatabaseDumpCommand } from '../impl/database-dump.command';

jest.mock('fs');

import { DatabaseDumpService } from '../../service/database-dump.service';
import { createDatabaseDumpServiceMock } from '../../service/database-dump.service.jest';
import { DatabaseDumpHandler } from './database-dump.handler';

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
