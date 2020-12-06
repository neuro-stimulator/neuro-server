import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcConnectionStatusQuery } from '../impl/ipc-connection-status.query';
import { IpcConnectionStatusHandler } from './ipc-connection-status.handler';
import { ConnectionStatus } from '@stechy1/diplomka-share';

describe('IpcConnectionStatusHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcConnectionStatusHandler;
  let service: MockType<IpcService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcConnectionStatusHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<IpcConnectionStatusHandler>(IpcConnectionStatusHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return information if asset player is connected or not', async () => {
    const status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
    const query = new IpcConnectionStatusQuery();

    Object.defineProperty(service, 'status', {
      get: jest.fn(() => status),
    });

    const result = await handler.execute(query);

    expect(result).toBe(status);
  });
});
