import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

import { ExperimentClearedEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';
import { PlayerExperimentClearedHandler } from './player-experiment-cleared.handler';

describe('PlayerExperimentClearedHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerExperimentClearedHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerExperimentClearedHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<PlayerExperimentClearedHandler>(PlayerExperimentClearedHandler);
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

  it('positive - should call experiment result clear command when next round is not available', async () => {
    const nextRoundAvailable = false;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    activeExperimentResult.outputCount = 1;
    const experimentResultData: IOEvent[][] = [[]];
    const event = new ExperimentClearedEvent();

    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => activeExperimentResult),
    });
    Object.defineProperty(service, 'experimentResultData', {
      get: jest.fn(() => experimentResultData),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ExperimentResultClearCommand());
  });

  it('positive - should call expeirment result clear command when next round is available, but experiment is uploaded or initialized only', async () => {
    const nextRoundAvailable = true;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    activeExperimentResult.outputCount = 1;
    const experimentResultData: IOEvent[][] = [[]];
    const event = new ExperimentClearedEvent();

    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => activeExperimentResult),
    });
    Object.defineProperty(service, 'experimentResultData', {
      get: jest.fn(() => experimentResultData),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ExperimentResultClearCommand());
  });

  it('positive - should not call experiment result clear command when next round is available', async () => {
    const nextRoundAvailable = true;
    const activeExperimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    activeExperimentResult.outputCount = 1;
    // @ts-ignore
    const experimentResultData: IOEvent[][] = [[{}, {}]];
    const event = new ExperimentClearedEvent();

    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => activeExperimentResult),
    });
    Object.defineProperty(service, 'experimentResultData', {
      get: jest.fn(() => experimentResultData),
    });

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });
});
