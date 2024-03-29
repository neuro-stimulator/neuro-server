import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult, IOEvent, PlayerConfiguration, StimulatorStateEvent } from '@stechy1/diplomka-share';

import { ExperimentResultInsertCommand, WriteExperimentResultToFileCommand } from '@neuro-server/stim-feature-experiment-results/application';
import {
  ExperimentClearCommand,
  ExperimentFinishedEvent,
  ExperimentRunCommand,
  SendStimulatorStateChangeToClientCommand,
} from '@neuro-server/stim-feature-stimulator/application';
import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';


import { PrepareNextExperimentRoundCommand } from '../../commands/impl/prepare-next-experiment-round.command';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';
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
    testingModule.useLogger(new NoOpLogger());

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
    const forceFinish = false;
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
    const event = new ExperimentFinishedEvent(forceFinish);

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

  it('positive - should end experiment when next round is available, but force is active', async () => {
    const userID = 0;
    const nextRoundAvailable = true;
    const forceFinish = true;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const experimentResultData: IOEvent[][] = [];
    const clearedState: StimulatorStateData = { name: 'ClearedState', noUpdate: false, state: 6, timestamp: Date.now() };
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
    const event = new ExperimentFinishedEvent(forceFinish);

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
    expect(commandBus.execute.mock.calls[2]).toEqual([new ExperimentClearCommand(true, forceFinish)]);
    expect(commandBus.execute.mock.calls[3]).toEqual([new SendStimulatorStateChangeToClientCommand(clearedState.state)]);
    expect(commandBus.execute.mock.calls[4]).toEqual([new SendPlayerStateToClientCommand(playerConfiguration)]);
  });

  it('positive - should not schedule next round when autoplay is disabled', async () => {
    const userID = 0;
    const userGroups = [1];
    const nextRoundAvailable = true;
    const autoplay = false;
    const forceFinish = false;
    const event = new ExperimentFinishedEvent(forceFinish);

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'userGroups', {
      get: jest.fn(() => userGroups),
    });
    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'autoplay', {
      get: jest.fn(() => autoplay),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new PrepareNextExperimentRoundCommand(userGroups));
    expect(service.scheduleNextRound).not.toBeCalled();
  });

  it('positive - should schedule next round when autoplay is enabled', async () => {
    const userID = 0;
    const userGroups = [1];
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
    const forceFinish = false;
    const event = new ExperimentFinishedEvent(forceFinish);

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'userGroups', {
      get: jest.fn(() => userGroups),
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
    commandBus.execute.mockReturnValueOnce(undefined); // SendPlayerStateToClientCommand
    commandBus.execute.mockReturnValueOnce(undefined); // PrepareNextExperimentRoundCommand
    commandBus.execute.mockReturnValueOnce(state); // ExperimentRunCommand

    await handler.handle(event);

    expect(commandBus.execute.mock.calls[0]).toEqual([new PrepareNextExperimentRoundCommand(userGroups)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new SendPlayerStateToClientCommand(playerConfiguration)]);
    expect(commandBus.execute.mock.calls[2]).toEqual([new ExperimentRunCommand(activeExperimentResult.experimentID, true)]);
    expect(commandBus.execute.mock.calls[3]).toEqual([new SendStimulatorStateChangeToClientCommand(state.state)]);
  });

  it('negative - should not do anything when userID is not defined', async () => {
    const userID = undefined;
    const forceFinish = false;
    const event = new ExperimentFinishedEvent(forceFinish);

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });
});
