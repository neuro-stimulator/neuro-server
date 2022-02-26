import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentPlayerStateMessage, ExperimentStopConditionType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SendPlayerStateToClientCommand } from '../../impl/to-client/send-player-state-to-client.command';

import { SendPlayerStateToClientHandler } from './send-player-state-to-client.handler';

describe('SendPlayerStateToClientHandler', () => {
  let testingModule: TestingModule;
  let handler: SendPlayerStateToClientHandler;
  let socketFacade: MockType<SocketFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SendPlayerStateToClientHandler,
        {
          provide: SocketFacade,
          useValue: { broadcastCommand: jest.fn(), sendCommand: jest.fn() },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SendPlayerStateToClientHandler>(SendPlayerStateToClientHandler);
    // @ts-ignore
    socketFacade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should send player state to one specific client', async () => {
    const playerConfiguration: PlayerConfiguration = {
      autoplay: false,
      stopConditions: {},
      stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
      betweenExperimentInterval: 0,
      initialized: false,
      ioData: [],
      isBreakTime: false,
      repeat: 0,
    };
    const clientID = 'some client id';
    const command = new SendPlayerStateToClientCommand(playerConfiguration, clientID);

    await handler.execute(command);

    expect(socketFacade.sendCommand).toBeCalledWith(clientID, new ExperimentPlayerStateMessage(playerConfiguration));
    expect(socketFacade.broadcastCommand).not.toBeCalled();
  });

  it('positive - should broadcast player state to all connected clients', async () => {
    const playerConfiguration: PlayerConfiguration = {
      autoplay: false,
      stopConditions: {},
      stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
      betweenExperimentInterval: 0,
      initialized: false,
      ioData: [],
      isBreakTime: false,
      repeat: 0,
    };
    const command = new SendPlayerStateToClientCommand(playerConfiguration);

    await handler.execute(command);

    expect(socketFacade.broadcastCommand).toBeCalledWith(new ExperimentPlayerStateMessage(playerConfiguration));
    expect(socketFacade.sendCommand).not.toBeCalled();
  });
});
