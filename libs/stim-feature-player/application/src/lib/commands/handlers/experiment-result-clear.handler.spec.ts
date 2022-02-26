import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { ExperimentResultClearCommand } from '../impl/experiment-result-clear.command';
import { SendPlayerStateToClientCommand } from '../impl/to-client/send-player-state-to-client.command';

import { ExperimentResultClearHandler } from './experiment-result-clear.handler';

describe('ExperimentResultClearHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultClearHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultClearHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultClearHandler>(ExperimentResultClearHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should clear experiment result', async () => {
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
    const command = new ExperimentResultClearCommand();

    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    await handler.execute(command);

    expect(service.clearRunningExperimentResult).toBeCalled();
    expect(commandBus.execute).toBeCalledWith(new SendPlayerStateToClientCommand(playerConfiguration));
  });
});
