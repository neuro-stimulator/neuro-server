import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { IpcMessage, IpcSendMessageCommand } from '@diplomka-backend/stim-feature-ipc';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcSendMessageHandler } from './ipc-send-message.handler';

describe('IpcSendMessageHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcSendMessageHandler;
  let service: MockType<IpcService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcSendMessageHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<IpcSendMessageHandler>(IpcSendMessageHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should send ipc message, when connection is established', async () => {
    const isConnected = true;
    const ipcMessage: IpcMessage<{}> = {
      data: {},
      topic: 'topic',
    };
    const command = new IpcSendMessageCommand(ipcMessage);

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => isConnected),
    });

    await handler.execute(command);

    expect(service.send).toBeCalledWith(ipcMessage);
  });

  it('negative - should not send ipc message, when connection is not established', async () => {
    const isConnected = false;
    const ipcMessage: IpcMessage<{}> = {
      data: {},
      topic: 'topic',
    };
    const command = new IpcSendMessageCommand(ipcMessage);

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => isConnected),
    });

    await handler.execute(command);

    expect(service.send).not.toBeCalledWith();
  });
});
