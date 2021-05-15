import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createMock } from '@golevelup/ts-jest';
import { Server, Socket } from 'socket.io';

import { SocketMessage, SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { ClientConnectedEvent, ClientDisconnectedEvent, MessageArivedEvent } from '@diplomka-backend/stim-lib-socket';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let testingModule: TestingModule;
  let service: SocketService;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SocketService,
        eventBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<SocketService>(SocketService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  function mockClientSocket(id = "random id") {
    return createMock<Socket>({
      id
    });
  }

  it('positive - should be definde', () => {
    expect(service).toBeDefined();
  });

  it('positive - should handle incomming connection', async () => {
    const client: Socket = mockClientSocket();

    service.handleConnection(client);

    expect(eventBus.publish).toBeCalledWith(new ClientConnectedEvent(client.id));
  });

  it('positive - should handle client disconnected', async () => {
    const client: Socket = mockClientSocket();

    service.handleDisconnect(client);

    expect(eventBus.publish).toBeCalledWith(new ClientDisconnectedEvent(client.id));
  });

  it('positive - should handle incomming command', async () => {
    const client: Socket = mockClientSocket();
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };

    service.handleCommand(client, message);

    expect(eventBus.publish).toBeCalledWith(new MessageArivedEvent(client.id, message));
  });

  it('positive - should be possible to send message to one client', async () => {
    const client: Socket = mockClientSocket();
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };

    service.handleConnection(client);
    service.sendCommand(client.id, message);

    expect(client.emit).toBeCalledWith('command', message);
  });

  it('positive - should be possible to broadcast message', async () => {
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };
    service.server = createMock<Server>();

    service.broadcastCommand(message);

    expect(service.server.emit).toBeCalledWith('command', message);
  });
});
