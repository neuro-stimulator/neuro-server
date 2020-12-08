import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult, ExperimentStopConditionType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';
import { ExperimentResultWasInitializedEvent } from '../impl/experiment-result-was-initialized.event';
import { PlayerExperimentResultWasInitializedHandler } from './player-experiment-result-was-initialized.handler';

describe('PlayerExperimentResultWasInitializedHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerExperimentResultWasInitializedHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerExperimentResultWasInitializedHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PlayerExperimentResultWasInitializedHandler>(PlayerExperimentResultWasInitializedHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should send command for start new experiment round', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const playerConfiguration: PlayerConfiguration = {
      autoplay: false,
      stopConditions: {},
      stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
      betweenExperimentInterval: 0,
      initialized: true,
      ioData: [],
      isBreakTime: false,
      repeat: 0,
    };
    const event = new ExperimentResultWasInitializedEvent(experimentResult);

    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new SendPlayerStateToClientCommand(playerConfiguration));
  });
});
