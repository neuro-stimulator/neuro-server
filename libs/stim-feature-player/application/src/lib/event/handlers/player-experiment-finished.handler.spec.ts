import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import {
  createEmptyExperiment,
  createEmptyExperimentResult,
  ExperimentResult,
  ExperimentStopConditionType,
  IOEvent,
  PlayerConfiguration,
  StimulatorStateEvent,
} from '@stechy1/diplomka-share';

import {
  ExperimentClearCommand,
  ExperimentFinishedEvent,
  ExperimentRunCommand,
  SendStimulatorStateChangeToClientCommand,
} from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { ExperimentResultInsertCommand, WriteExperimentResultToFileCommand } from '@diplomka-backend/stim-feature-experiment-results/application';

import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';
import { PrepareNextExperimentRoundCommand } from '../../commands/impl/prepare-next-experiment-round.command';
import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerExperimentFinishedHandler } from './player-experiment-finished.handler';

describe('PlayerExperimentFinishedHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerExperimentFinishedHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerExperimentFinishedHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<PlayerExperimentFinishedHandler>(PlayerExperimentFinishedHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should end experiment when next round is not available', async () => {
    const userID = 0;
    const nextRoundAvailable = false;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const experimentResultData: IOEvent[][] = [];
    const clearedState: StimulatorStateData = { name: 'ClearedState', noUpdate: false, state: 6, timestamp: Date.now() };
    const playerConfiguration: PlayerConfiguration = {
      repeat: 0,
      betweenExperimentInterval: 0,
      autoplay: false,
      stopConditionType: -1,
      stopConditions: {},
      initialized: false,
      ioData: [],
      isBreakTime: false,
    };
    const event = new ExperimentFinishedEvent();

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => activeExperimentResult),
    });
    Object.defineProperty(service, 'experimentResultData', {
      get: jest.fn(() => experimentResultData),
    });
    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    commandBus.execute.mockReturnValueOnce(null);
    commandBus.execute.mockReturnValueOnce(null);
    commandBus.execute.mockReturnValueOnce(clearedState);

    await handler.handle(event);

    expect(commandBus.execute.mock.calls[0]).toEqual([new WriteExperimentResultToFileCommand(activeExperimentResult, experimentResultData)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new ExperimentResultInsertCommand(activeExperimentResult, userID)]);
    expect(commandBus.execute.mock.calls[2]).toEqual([new ExperimentClearCommand(true)]);
    expect(commandBus.execute.mock.calls[3]).toEqual([new SendStimulatorStateChangeToClientCommand(clearedState.state)]);
    expect(commandBus.execute.mock.calls[4]).toEqual([new SendPlayerStateToClientCommand(playerConfiguration)]);
  });

  it('positive - should not schedule next round when autoplay is disabled', async () => {
    const userID = 0;
    const nextRoundAvailable = true;
    const autoplay = false;
    const event = new ExperimentFinishedEvent();

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'autoplay', {
      get: jest.fn(() => autoplay),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new PrepareNextExperimentRoundCommand(userID));
    expect(service.scheduleNextRound).not.toBeCalled();
  });

  it('positive - should schedule next round when autoplay is enabled', async () => {
    const userID = 0;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    activeExperimentResult.experimentID = 1;
    const nextRoundAvailable = true;
    const state: StimulatorStateEvent = { name: StimulatorStateData.name, state: 1, noUpdate: true, timestamp: Date.now() };
    const playerConfiguration: PlayerConfiguration = {
      repeat: 0,
      betweenExperimentInterval: 0,
      autoplay: true,
      stopConditionType: -1,
      stopConditions: {},
      initialized: false,
      ioData: [],
      isBreakTime: false,
    };
    const event = new ExperimentFinishedEvent();

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'autoplay', {
      get: jest.fn(() => playerConfiguration.autoplay),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => activeExperimentResult),
    });
    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    service.scheduleNextRound.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    commandBus.execute.mockReturnValueOnce(undefined); // PrepareNextExperimentRoundCommand
    commandBus.execute.mockReturnValueOnce(undefined); // SendPlayerStateToClientCommand
    commandBus.execute.mockReturnValueOnce(state); // ExperimentRunCommand

    await handler.handle(event);

    expect(commandBus.execute.mock.calls[0]).toEqual([new PrepareNextExperimentRoundCommand(userID)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new SendPlayerStateToClientCommand(playerConfiguration)]);
    expect(commandBus.execute.mock.calls[2]).toEqual([new ExperimentRunCommand(activeExperimentResult.experimentID, true)]);
    expect(commandBus.execute.mock.calls[3]).toEqual([new SendStimulatorStateChangeToClientCommand(state.state)]);
  });
});
