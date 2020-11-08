import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { IpcMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { MockType, eventBusProvider } from 'test-helpers/test-helpers';
import { IpcMessageEvent } from '../impl/ipc-message.event';

import { IpcEvent } from '../impl/ipc.event';
import { IpcMessageHandler } from './ipc-message.handler';

describe('IpcMessageHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcMessageHandler;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcMessageHandler, eventBusProvider],
    }).compile();

    handler = testingModule.get<IpcMessageHandler>(IpcMessageHandler);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should handle connected event', async () => {
    const json: IpcMessage<{ name: string }> = { commandID: 3, topic: 'test', data: { name: 'some-name' } };
    const buffer = Buffer.from(JSON.stringify(json), 'utf-8');
    const event = new IpcMessageEvent(buffer);

    await handler.handle(event);

    expect(eventBus.publish).toBeCalledWith(new IpcEvent(json));
  });
});
