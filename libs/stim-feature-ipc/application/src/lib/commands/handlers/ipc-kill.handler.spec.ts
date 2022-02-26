import { Test, TestingModule } from '@nestjs/testing';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { AssetPlayerNotRunningException, ExitMessage } from '@neuro-server/stim-feature-ipc/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcKillCommand } from '../impl/ipc-kill.command';

import { IpcKillHandler } from './ipc-kill.handler';

describe('IpcKillHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcKillHandler;
  let service: MockType<IpcService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcKillHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcKillHandler>(IpcKillHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
    testingModule.useLogger(new NoOpLogger());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call service', async () => {
    const command = new IpcKillCommand();

    Object.defineProperty(service, 'status', {
      get: jest.fn(() => ConnectionStatus.CONNECTED)
    });

    await handler.execute(command);

    expect(service.send).toBeCalledWith(new ExitMessage());
  });

  it('negative - should throw exception when asset player is not connected', () => {
    const command = new IpcKillCommand();

    Object.defineProperty(service, 'status', {
      get: jest.fn(() => ConnectionStatus.DISCONNECTED)
    });

    expect(() => handler.execute(command)).rejects.toThrow(new AssetPlayerNotRunningException());
  });
});
