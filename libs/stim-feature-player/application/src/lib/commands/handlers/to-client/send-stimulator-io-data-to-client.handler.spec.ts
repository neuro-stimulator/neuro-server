import { Test, TestingModule } from '@nestjs/testing';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { MockType } from 'test-helpers/test-helpers';

import { SendStimulatorIoDataToClientHandler } from './send-stimulator-io-data-to-client.handler';
import { ExperimentPlayerDataIOMessage, IOEvent } from '@stechy1/diplomka-share';
import { SendStimulatorIoDataToClientCommand } from '../../impl/to-client/send-stimulator-io-data-to-client.command';

describe('SendStimulatorIoDataToClientHandler', () => {
  let testingModule: TestingModule;
  let handler: SendStimulatorIoDataToClientHandler;
  let socketFacade: MockType<SocketFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SendStimulatorIoDataToClientHandler,
        {
          provide: SocketFacade,
          useValue: { broadcastCommand: jest.fn() },
        },
      ],
    }).compile();

    handler = testingModule.get<SendStimulatorIoDataToClientHandler>(SendStimulatorIoDataToClientHandler);
    // @ts-ignore
    socketFacade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should broadcast IO event to all clients', async () => {
    const ioEvent: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const command = new SendStimulatorIoDataToClientCommand(ioEvent);

    await handler.execute(command);

    expect(socketFacade.broadcastCommand).toBeCalledWith(new ExperimentPlayerDataIOMessage(ioEvent));
  });
});
