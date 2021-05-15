import { Test, TestingModule } from '@nestjs/testing';

import { SocketMessage, SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { BroadcastCommand } from '@diplomka-backend/stim-lib-socket';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SocketService } from '../../../domain/services/socket.service';
import { createSocketServiceMock } from '../../../domain/services/socket.service.jest';
import { BroadcastHandler } from './broadcast.handler';

describe('BroadcastHandler', () => {
  let testingModule: TestingModule;
  let handler: BroadcastHandler;
  let socketService: MockType<SocketService>

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        BroadcastHandler,
        {
          provide: SocketService,
          useFactory: createSocketServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<BroadcastHandler>(BroadcastHandler);
    // @ts-ignore
    socketService = testingModule.get<MockType<SocketService>>(SocketService);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call service', async () => {
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };
    const command = new BroadcastCommand(message);

    await handler.execute(command);

    expect(socketService.broadcastCommand).toBeCalledWith(message);
  });
});
