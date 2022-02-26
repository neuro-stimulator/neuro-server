import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ClientConnectionReadyEvent } from '../../events/impl/client-connection-ready.event';

import { PublishClientReadyHandler } from './publish-client-ready.handler';

describe('BroadcastHandler', () => {
  let testingModule: TestingModule;
  let handler: PublishClientReadyHandler;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PublishClientReadyHandler,
        eventBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PublishClientReadyHandler>(PublishClientReadyHandler);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call service', async () => {
    const clientID = 'clientID';
    const command = new ClientConnectionReadyEvent(clientID);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ClientConnectionReadyEvent(clientID));
  });
});
