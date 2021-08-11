import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcService } from '../../services/ipc.service';
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call service', async () => {
    const command = new IpcKillCommand();

    await handler.execute(command);

    expect(service.kill).toBeCalled();
  });
});
