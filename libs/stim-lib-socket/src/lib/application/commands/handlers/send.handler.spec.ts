import { Test, TestingModule } from '@nestjs/testing';

import { SocketMessage, SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SocketService } from '../../../domain/services/socket.service';
import { createSocketServiceMock } from '../../../domain/services/socket.service.jest';
import { SendCommand } from '../impl/send.command';

import { SendHandler } from './send.handler';

describe('SendHandler', () => {
  let testingModule: TestingModule;
  let handler: SendHandler;
  let socketService: MockType<SocketService>

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SendHandler,
        {
          provide: SocketService,
          useFactory: createSocketServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SendHandler>(SendHandler);
    // @ts-ignore
    socketService = testingModule.get<MockType<SocketService>>(SocketService);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call service', async () => {
    const clientID = 'clientID'
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };
    const command = new SendCommand(clientID, message);

    await handler.execute(command);

    expect(socketService.sendCommand).toBeCalledWith(clientID, message);
  });
});
