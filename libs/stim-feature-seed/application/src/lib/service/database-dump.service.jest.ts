import { MockType } from 'test-helpers/test-helpers';

import { DatabaseDumpService } from './database-dump.service';

export const createDatabaseDumpServiceMock: () => MockType<DatabaseDumpService> = jest.fn(() => ({
  dumpDatabase: jest.fn(),
}));
