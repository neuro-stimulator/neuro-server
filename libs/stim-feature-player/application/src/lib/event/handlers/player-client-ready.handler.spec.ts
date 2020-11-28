import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerClientReadyHandler } from './player-client-ready.handler';
import { ExperimentStopConditionType, PlayerConfiguration } from '@stechy1/diplomka-share';
import { ClientConnectionReadyEvent } from '@diplomka-backend/stim-lib-socket';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';

describe('PlayerClientReadyHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerClientReadyHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerClientReadyHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<PlayerClientReadyHandler>(PlayerClientReadyHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should execute command to send player state informations', async () => {
    const clientID = 'some client id';
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
    const event = new ClientConnectionReadyEvent(clientID);

    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new SendPlayerStateToClientCommand(playerConfiguration, clientID));
  });
});
