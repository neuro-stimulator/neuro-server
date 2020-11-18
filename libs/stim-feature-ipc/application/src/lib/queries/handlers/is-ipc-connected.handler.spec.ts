import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IsIpcConnectedQuery } from '../impl/is-ipc-connected.query';
import { IsIpcConnectedHandler } from './is-ipc-connected.handler';

describe('IsIpcConnectedHandler', () => {
  let testingModule: TestingModule;
  let handler: IsIpcConnectedHandler;
  let service: MockType<IpcService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IsIpcConnectedHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<IsIpcConnectedHandler>(IsIpcConnectedHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return information if asset player is connected or not', async () => {
    const isConnected = false;
    const query = new IsIpcConnectedQuery();

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => isConnected),
    });

    const result = await handler.execute(query);

    expect(result).toBe(isConnected);
  });
});
